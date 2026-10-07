export type ListingType = "resale" | "auction" | "distressed" | "builder" | "rent";
export type PropertyType = "flat" | "house" | "villa" | "plot" | "commercial";

export interface Property {
  id: number;
  slug: string;
  title: string;
  listing_type: ListingType;
  property_type: PropertyType;
  city: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  market_price: number | null;
  area_sqft: number;
  bedrooms: number | null;
  bathrooms: number | null;
  facing: string | null;
  furnishing: string | null;
  floor: number | null;
  total_floors: number | null;
  age_years: number | null;
  possession: string | null;
  description: string;
  amenities: string[];
  verified: boolean;
  posted_by: string;
  auction_date: string | null;
  bank_name: string | null;
  emd: number | null;
  possession_type: string | null;
  created_at: string;
  price_per_sqft: number | null;
  discount_pct: number | null;
}

export interface PropertyList {
  items: Property[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface Locality {
  name: string;
  slug: string;
  count: number;
  avg_price_per_sqft: number | null;
  lat: number;
  lng: number;
}

export interface Stats {
  listings: number;
  auctions: number;
  verified: number;
  localities: number;
}
