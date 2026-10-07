from datetime import datetime
from sqlalchemy import JSON, Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    # resale | auction | distressed | builder | rent
    listing_type: Mapped[str] = mapped_column(String(20), index=True)
    # flat | house | villa | plot | commercial
    property_type: Mapped[str] = mapped_column(String(20), index=True)
    city: Mapped[str] = mapped_column(String(60), default="Indore", index=True)
    locality: Mapped[str] = mapped_column(String(80), index=True)
    address: Mapped[str] = mapped_column(String(250))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)

    # For auctions, `price` is the reserve price.
    price: Mapped[int] = mapped_column(Integer, index=True)
    market_price: Mapped[int | None] = mapped_column(Integer, nullable=True)
    area_sqft: Mapped[int] = mapped_column(Integer)
    bedrooms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bathrooms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    facing: Mapped[str | None] = mapped_column(String(20), nullable=True)
    furnishing: Mapped[str | None] = mapped_column(String(30), nullable=True)
    floor: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_floors: Mapped[int | None] = mapped_column(Integer, nullable=True)
    age_years: Mapped[int | None] = mapped_column(Integer, nullable=True)
    possession: Mapped[str | None] = mapped_column(String(60), nullable=True)
    description: Mapped[str] = mapped_column(Text, default="")
    amenities: Mapped[list] = mapped_column(JSON, default=list)

    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)  # pending | live | rejected
    posted_by: Mapped[str] = mapped_column(String(20), default="owner")  # owner | broker | builder | bank

    # Auction fields
    auction_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, index=True)
    bank_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    emd: Mapped[int | None] = mapped_column(Integer, nullable=True)
    possession_type: Mapped[str | None] = mapped_column(String(30), nullable=True)  # symbolic | physical | unknown

    # Private contact (never returned by the public API)
    contact_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    contact_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True)
    property_slug: Mapped[str | None] = mapped_column(String(220), nullable=True, index=True)
    kind: Mapped[str] = mapped_column(String(20), default="buyer")  # buyer | assistance | seller
    name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20))
    email: Mapped[str | None] = mapped_column(String(160), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
