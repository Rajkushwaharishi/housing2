import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, computed_field, field_serializer, field_validator

PHONE_RE = re.compile(r"^[6-9]\d{9}$")


def _clean_phone(v: str) -> str:
    v = re.sub(r"[\s-]", "", v).removeprefix("+91")
    if not PHONE_RE.match(v):
        raise ValueError("Enter a 10-digit Indian mobile number")
    return v


class PropertyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    listing_type: str
    property_type: str
    city: str
    locality: str
    address: str
    lat: float
    lng: float
    price: int
    market_price: int | None
    area_sqft: int
    bedrooms: int | None
    bathrooms: int | None
    facing: str | None
    furnishing: str | None
    floor: int | None
    total_floors: int | None
    age_years: int | None
    possession: str | None
    description: str
    amenities: list[str]
    verified: bool
    posted_by: str
    auction_date: datetime | None
    bank_name: str | None
    emd: int | None
    possession_type: str | None
    created_at: datetime

    @computed_field  # type: ignore[misc]
    @property
    def price_per_sqft(self) -> int | None:
        if self.listing_type == "rent" or not self.area_sqft:
            return None
        return round(self.price / self.area_sqft)

    @computed_field  # type: ignore[misc]
    @property
    def discount_pct(self) -> int | None:
        if self.market_price and self.market_price > self.price and self.listing_type != "rent":
            return round((self.market_price - self.price) * 100 / self.market_price)
        return None

    # Datetimes are stored as naive UTC; send them with an explicit Z.
    @field_serializer("auction_date", "created_at")
    def _utc(self, v: datetime | None):
        return v.isoformat() + "Z" if v else None


class PropertyList(BaseModel):
    items: list[PropertyOut]
    total: int
    page: int
    page_size: int
    pages: int


class LocalityOut(BaseModel):
    name: str
    slug: str
    count: int
    avg_price_per_sqft: int | None
    lat: float
    lng: float


class StatsOut(BaseModel):
    listings: int
    auctions: int
    verified: int
    localities: int


class LeadIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str
    email: str | None = Field(default=None, max_length=160)
    message: str | None = Field(default=None, max_length=1000)
    property_slug: str | None = None
    kind: Literal["buyer", "assistance", "seller"] = "buyer"

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return _clean_phone(v)


class PropertyIn(BaseModel):
    listing_type: Literal["resale", "rent"] = "resale"
    property_type: Literal["flat", "house", "villa", "plot", "commercial"]
    locality: str
    address: str | None = Field(default=None, max_length=250)
    price: int = Field(gt=0)
    area_sqft: int = Field(gt=0)
    bedrooms: int | None = Field(default=None, ge=0, le=10)
    bathrooms: int | None = Field(default=None, ge=0, le=10)
    facing: str | None = None
    furnishing: str | None = None
    description: str = Field(default="", max_length=2000)
    posted_by: Literal["owner", "broker", "builder"] = "owner"
    contact_name: str = Field(min_length=2, max_length=100)
    contact_phone: str

    @field_validator("contact_phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return _clean_phone(v)


class SlugOut(BaseModel):
    slug: str
    updated: str
