import os
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import case, func, or_, select
from sqlalchemy.orm import Session

from .db import SessionLocal, engine, get_db
from .localities import LOCALITIES
from .models import Base, Lead, Property
from .schemas import (LeadIn, LocalityOut, PropertyIn, PropertyList, PropertyOut, SlugOut, StatsOut)
from .seed import seed_if_empty, slugify


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        seed_if_empty(db)
    yield


app = FastAPI(title="ZameenMauka API", version="0.1.0", lifespan=lifespan)

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])


def _now() -> datetime:
    return datetime.utcnow()


def _live_conditions():
    # Live listings only; hide auctions whose date has passed.
    return [
        Property.status == "live",
        or_(Property.auction_date.is_(None), Property.auction_date >= _now()),
    ]


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/properties", response_model=PropertyList)
def list_properties(
    listing_type: str | None = None,
    property_type: str | None = None,
    locality: str | None = None,
    bhk: str | None = None,
    min_price: int | None = Query(None, ge=0),
    max_price: int | None = Query(None, ge=0),
    facing: str | None = None,
    verified: bool = False,
    q: str | None = None,
    sort: str = "newest",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    conds = _live_conditions()
    if listing_type:
        conds.append(Property.listing_type.in_([x.strip() for x in listing_type.split(",") if x.strip()]))
    if property_type:
        conds.append(Property.property_type.in_([x.strip() for x in property_type.split(",") if x.strip()]))
    if locality:
        conds.append(func.lower(Property.locality) == locality.lower())
    if bhk:
        nums = [int(x) for x in bhk.split(",") if x.strip().isdigit()]
        clauses = [Property.bedrooms == n for n in nums if n < 4]
        if any(n >= 4 for n in nums):
            clauses.append(Property.bedrooms >= 4)
        if clauses:
            conds.append(or_(*clauses))
    if min_price is not None:
        conds.append(Property.price >= min_price)
    if max_price is not None:
        conds.append(Property.price <= max_price)
    if facing:
        conds.append(func.lower(Property.facing) == facing.lower())
    if verified:
        conds.append(Property.verified.is_(True))
    if q:
        like = f"%{q.strip()}%"
        conds.append(or_(Property.title.ilike(like), Property.locality.ilike(like), Property.description.ilike(like)))

    if sort == "price_asc":
        order = [Property.price.asc()]
    elif sort == "price_desc":
        order = [Property.price.desc()]
    elif sort == "soonest":
        order = [Property.auction_date.asc()]
    elif sort == "discount":
        order = [((Property.market_price - Property.price) * 1.0 / Property.market_price).desc().nullslast()]
    else:
        order = [Property.created_at.desc()]

    total = db.scalar(select(func.count(Property.id)).where(*conds)) or 0
    rows = db.scalars(
        select(Property).where(*conds).order_by(*order, Property.id.desc())
        .offset((page - 1) * page_size).limit(page_size)
    ).all()
    return PropertyList(
        items=[PropertyOut.model_validate(r) for r in rows],
        total=total, page=page, page_size=page_size, pages=max(1, -(-total // page_size)),
    )


@app.get("/api/properties/{slug}", response_model=PropertyOut)
def get_property(slug: str, db: Session = Depends(get_db)):
    row = db.scalar(select(Property).where(Property.slug == slug, *_live_conditions()))
    if not row:
        raise HTTPException(404, "Property not found")
    return row


@app.get("/api/properties/{slug}/similar", response_model=list[PropertyOut])
def similar(slug: str, db: Session = Depends(get_db)):
    me = db.scalar(select(Property).where(Property.slug == slug))
    if not me:
        raise HTTPException(404, "Property not found")
    same_locality = case((Property.locality == me.locality, 1), else_=0)
    rows = db.scalars(
        select(Property)
        .where(Property.slug != slug, Property.property_type == me.property_type,
               Property.listing_type == me.listing_type, *_live_conditions())
        .order_by(same_locality.desc(), func.abs(Property.price - me.price))
        .limit(3)
    ).all()
    return rows


@app.get("/api/localities", response_model=list[LocalityOut])
def localities(db: Session = Depends(get_db)):
    rows = db.execute(
        select(
            Property.locality, func.count(Property.id),
            func.avg(Property.price * 1.0 / Property.area_sqft),
        ).where(Property.listing_type != "rent", *_live_conditions()).group_by(Property.locality)
    ).all()
    out = []
    for name, count, avg in rows:
        lat, lng = LOCALITIES.get(name, (22.7196, 75.8577))
        out.append(LocalityOut(name=name, slug=slugify(name), count=count,
                               avg_price_per_sqft=round(avg) if avg else None, lat=lat, lng=lng))
    return sorted(out, key=lambda x: -x.count)


@app.get("/api/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    live = _live_conditions()
    return StatsOut(
        listings=db.scalar(select(func.count(Property.id)).where(*live)) or 0,
        auctions=db.scalar(select(func.count(Property.id)).where(Property.listing_type == "auction", *live)) or 0,
        verified=db.scalar(select(func.count(Property.id)).where(Property.verified.is_(True), *live)) or 0,
        localities=db.scalar(select(func.count(func.distinct(Property.locality))).where(*live)) or 0,
    )


@app.get("/api/slugs", response_model=list[SlugOut])
def slugs(db: Session = Depends(get_db)):
    rows = db.execute(select(Property.slug, Property.created_at).where(*_live_conditions())).all()
    return [SlugOut(slug=s, updated=c.isoformat() + "Z") for s, c in rows]


@app.post("/api/leads", status_code=201)
def create_lead(body: LeadIn, db: Session = Depends(get_db)):
    if body.property_slug and not db.scalar(select(Property.id).where(Property.slug == body.property_slug)):
        raise HTTPException(404, "Property not found")
    db.add(Lead(**body.model_dump()))
    db.commit()
    return {"ok": True}


@app.post("/api/properties", status_code=201)
def create_property(body: PropertyIn, db: Session = Depends(get_db)):
    if body.locality not in LOCALITIES:
        raise HTTPException(422, "Choose a locality from the list")
    lat, lng = LOCALITIES[body.locality]
    bhk = body.bedrooms if body.property_type in ("flat", "house", "villa") else None
    label = {"flat": "Flat", "house": "Independent House", "villa": "Villa", "plot": "Residential Plot", "commercial": "Commercial Space"}[body.property_type]
    title = f"{bhk} BHK {label} in {body.locality}" if bhk else f"{label} in {body.locality}"
    n = (db.scalar(select(func.count(Property.id))) or 0) + 1
    slug = f"{slugify(title)}-{n:05d}"
    db.add(Property(
        slug=slug, title=title, listing_type=body.listing_type, property_type=body.property_type, city="Indore",
        locality=body.locality, address=body.address or f"{body.locality}, Indore, Madhya Pradesh",
        lat=lat, lng=lng, price=body.price, area_sqft=body.area_sqft, bedrooms=body.bedrooms, bathrooms=body.bathrooms,
        facing=body.facing, furnishing=body.furnishing, description=body.description, amenities=[],
        verified=False, status="pending", posted_by=body.posted_by,
        contact_name=body.contact_name, contact_phone=body.contact_phone,
    ))
    db.commit()
    return {"ok": True, "status": "pending"}
