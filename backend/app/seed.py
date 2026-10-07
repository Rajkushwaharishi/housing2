"""Sample listings for local development. All data here is fictional."""
import hashlib
import re
from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .localities import LOCALITIES
from .models import Property

L, CR = 100_000, 10_000_000

FLAT_AM = ["Lift", "24x7 security", "Covered parking", "Power backup", "Gym", "Children's play area"]
HOUSE_AM = ["Car parking", "Terrace", "Water storage tank", "Gated colony", "Park nearby"]
PLOT_AM = ["Approved layout", "Road access", "Water connection", "Street lights", "Gated colony"]
COM_AM = ["Lift", "Power backup", "Visitor parking", "CCTV", "Fire safety"]
AMEN = {"flat": FLAT_AM, "house": HOUSE_AM, "villa": HOUSE_AM + ["Garden"], "plot": PLOT_AM, "commercial": COM_AM}


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def _title(lt, pt, loc, bhk):
    if pt == "flat":
        return f"{bhk} BHK Flat in {loc}"
    if pt == "house":
        return f"{bhk} BHK Independent House in {loc}" if bhk else f"Independent House in {loc}"
    if pt == "villa":
        return f"{bhk} BHK Villa in {loc}"
    if pt == "plot":
        return f"Residential Plot in {loc}"
    return f"Commercial Space in {loc}"


def P(lt, pt, loc, price, area, bhk=None, bath=None, facing=None, floor=None, total=None, age=None,
      poss="Ready to move", furn=None, by="owner", verified=True, desc="", market=None, days_ago=1,
      auction_in=None, bank=None, emd=None, ptype2=None, title=None, am=None):
    return dict(lt=lt, pt=pt, loc=loc, price=price, area=area, bhk=bhk, bath=bath, facing=facing, floor=floor,
                total=total, age=age, poss=poss, furn=furn, by=by, verified=verified, desc=desc, market=market,
                days_ago=days_ago, auction_in=auction_in, bank=bank, emd=emd, ptype2=ptype2, title=title, am=am)


SAMPLES = [
    P("resale", "flat", "Vijay Nagar", int(1.15 * CR), 1450, 3, 3, "East", 7, 14, 3, furn="Semi-furnished",
      desc="Corner flat on the seventh floor with a balcony facing the main road. Society has a clubhouse and two lifts per tower.", days_ago=1),
    P("resale", "house", "Vijay Nagar", int(1.38 * CR), 1650, 3, 3, "East", None, 2, 6, furn="Unfurnished", by="broker",
      desc="Duplex house on a 30x50 plot in a quiet lane. Ground floor parking, two bedrooms upstairs, and a small terrace garden.", days_ago=3),
    P("resale", "flat", "Palasia", int(1.05 * CR), 1100, 2, 2, "North", 4, 9, 8, furn="Furnished",
      desc="Well kept 2 BHK close to the main Palasia market. Modular kitchen and wardrobes are included in the price.", days_ago=2),
    P("resale", "flat", "Palasia", int(2.1 * CR), 1800, 3, 3, "West", 9, 12, 2, furn="Semi-furnished", by="broker",
      desc="Large 3 BHK on a high floor with open views. Two covered parking spots and a separate servant room.", days_ago=5),
    P("resale", "flat", "Scheme 78", 92 * L, 1050, 2, 2, "East", 3, 7, 5, furn="Semi-furnished",
      desc="Compact and well planned 2 BHK in a gated society. Walkable to schools and a daily market.", days_ago=4),
    P("resale", "flat", "Bhawarkuan", 58 * L, 980, 2, 2, "North", 2, 5, 7, furn="Unfurnished",
      desc="Ground-plus-five building with a lift. Close to the AB Road corridor and bus routes.", days_ago=6),
    P("resale", "house", "Nipania", 78 * L, 1500, 3, 2, "South", None, 2, 9, furn="Unfurnished", by="broker",
      desc="Independent house in a developed colony with a wide approach road. Extra room on the first floor can be used as a study.", days_ago=7),
    P("resale", "flat", "Super Corridor", 52 * L, 1040, 2, 2, "East", 5, 10, 2, furn="Unfurnished", verified=False,
      desc="Recent construction near the IT park belt. Covered parking and power backup for common areas.", days_ago=8),
    P("resale", "flat", "Sudama Nagar", 44 * L, 900, 2, 1, "North", 1, 4, 10, furn="Semi-furnished",
      desc="First floor flat in a small society. Quiet lane, regular water supply, and no lift.", days_ago=10),
    P("resale", "commercial", "Vijay Nagar", int(1.2 * CR), 800, None, 2, None, 3, 6, 4, by="broker", title="Office Space in Vijay Nagar",
      desc="Furnished office on the third floor of a commercial complex. Suitable for a small team or clinic.", days_ago=9),
    P("builder", "flat", "Super Corridor", 74 * L, 1380, 3, 3, "East", 8, 18, 0, poss="Dec 2027", by="builder",
      desc="Under construction tower with a podium garden and a clubhouse. Payment plan linked to construction stages.", days_ago=2),
    P("builder", "flat", "Bicholi Mardana", 56 * L, 1020, 2, 2, "North", 6, 14, 0, poss="Jun 2027", by="builder",
      desc="2 BHK in a mid-size project near the bypass. Ask the builder for the RERA registration number before booking.", days_ago=4),
    P("builder", "villa", "Rau", 98 * L, 1900, 3, 3, "East", None, 2, 0, poss="Mar 2027", by="builder", furn="Unfurnished",
      desc="Row villa in a gated plotted township. Private garden, two-car parking, and a community hall.", days_ago=3),
    P("resale", "plot", "Rau", 42 * L, 1500, facing="East", poss="Immediate", by="broker", age=None,
      desc="Corner plot in an approved colony. Roads and drainage are in place; construction has started on neighbouring plots.", days_ago=6),
    P("resale", "plot", "Super Corridor", 78 * L, 2400, facing="North", poss="Immediate", by="broker",
      desc="Rectangular plot on a 40 ft road. Suitable for a house or a small commercial use, subject to the layout approval.", days_ago=5),
    P("resale", "plot", "Silicon City", 31 * L, 1200, facing="West", poss="Immediate",
      desc="Residential plot in a developing colony. Electricity and water lines are available at the colony gate.", days_ago=11),
    P("resale", "plot", "Nipania", 70 * L, 2000, facing="East", poss="Immediate", by="broker", verified=False,
      desc="Plot close to the main road with an established neighbourhood. Clear boundaries marked on site.", days_ago=12),
    P("auction", "house", "Rau", int(38.5 * L), 1450, 3, 2, "East", None, 2, 8, poss="To be verified", market=52 * L, auction_in=18,
      bank="Sample Bank Ltd.", emd=int(3.85 * L), ptype2="symbolic", by="bank", furn="Unfurnished",
      desc="Independent house offered under a secured-asset sale. Inspection is allowed on notified dates only.", days_ago=2),
    P("auction", "flat", "Vijay Nagar", 55 * L, 1000, 2, 2, "North", 4, 8, 6, poss="To be verified", market=78 * L, auction_in=9,
      bank="Sample Co-operative Bank", emd=int(5.5 * L), ptype2="symbolic", by="bank",
      desc="Flat in a registered society. Society dues, if any, are to be confirmed by the bidder before the auction.", days_ago=3),
    P("auction", "plot", "Bicholi Mardana", 41 * L, 2000, facing="South", poss="To be verified", market=60 * L, auction_in=27,
      bank="Sample Bank Ltd.", emd=int(4.1 * L), ptype2="unknown", by="bank",
      desc="Residential plot offered by a bank. Check the layout approval and boundary on site before bidding.", days_ago=4),
    P("auction", "commercial", "Palasia", 62 * L, 450, None, 1, None, 0, 4, 12, poss="To be verified", market=85 * L, auction_in=13,
      bank="Sample Finance Corp.", emd=int(6.2 * L), ptype2="physical", by="bank", title="Shop in Palasia",
      desc="Ground floor shop on a busy road. Physical possession is stated in the notice; confirm on site.", days_ago=1),
    P("distressed", "flat", "Bhawarkuan", 68 * L, 1350, 3, 2, "East", 5, 8, 6, market=80 * L, furn="Semi-furnished",
      desc="Owner is relocating and wants a quick closure. Priced about 15% below similar flats in the same society.", days_ago=2),
    P("distressed", "house", "Sudama Nagar", int(1.05 * CR), 2200, 4, 4, "North", None, 2, 12, market=int(1.35 * CR), furn="Unfurnished",
      desc="Large four-bedroom house with a separate entrance for the upper floor. Family settlement sale, documents ready.", days_ago=5),
    P("rent", "flat", "Vijay Nagar", 28_000, 1150, 2, 2, "East", 6, 12, 3, furn="Furnished",
      desc="Fully furnished 2 BHK with AC in both bedrooms. Maintenance is included in the rent.", days_ago=1),
    P("rent", "flat", "Palasia", 42_000, 1700, 3, 3, "North", 8, 12, 4, furn="Semi-furnished", by="broker",
      desc="Spacious 3 BHK for families. Two parking spots and 24x7 security.", days_ago=3),
    P("rent", "flat", "Super Corridor", 16_000, 1000, 2, 2, "West", 3, 9, 2, furn="Semi-furnished",
      desc="Near the IT park. Wardrobes and modular kitchen provided; tenants to bring beds and appliances.", days_ago=2),
]


def seed_if_empty(db: Session) -> None:
    if db.scalar(select(func.count(Property.id))):
        return
    now = datetime.utcnow()
    for i, s in enumerate(SAMPLES):
        lat, lng = LOCALITIES[s["loc"]]
        # Small deterministic offset so markers in a locality don't stack.
        h = int(hashlib.sha1(f"{i}{s['loc']}".encode()).hexdigest()[:6], 16)
        lat += ((h % 200) - 100) / 100_000 * 6
        lng += (((h // 200) % 200) - 100) / 100_000 * 6
        title = s["title"] or _title(s["lt"], s["pt"], s["loc"], s["bhk"])
        slug = f"{slugify(title)}-{hashlib.sha1(f'{title}{i}'.encode()).hexdigest()[:6]}"
        auction_date = None
        if s["auction_in"] is not None:
            auction_date = (now + timedelta(days=s["auction_in"])).replace(hour=5, minute=30, second=0, microsecond=0)  # 11:00 IST
        db.add(Property(
            slug=slug, title=title, listing_type=s["lt"], property_type=s["pt"], city="Indore", locality=s["loc"],
            address=f"{s['loc']}, Indore, Madhya Pradesh", lat=lat, lng=lng, price=s["price"], market_price=s["market"],
            area_sqft=s["area"], bedrooms=s["bhk"], bathrooms=s["bath"], facing=s["facing"], furnishing=s["furn"],
            floor=s["floor"], total_floors=s["total"], age_years=s["age"], possession=s["poss"], description=s["desc"],
            amenities=AMEN[s["pt"]], verified=s["verified"], status="live", posted_by=s["by"],
            auction_date=auction_date, bank_name=s["bank"], emd=s["emd"], possession_type=s["ptype2"],
            contact_name="Demo contact", contact_phone="9000000000",
            created_at=now - timedelta(days=s["days_ago"], hours=i),
        ))
    db.commit()
