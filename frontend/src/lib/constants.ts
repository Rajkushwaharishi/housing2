export const CITY = { slug: "indore", name: "Indore" };

export const LOCALITY_NAMES = [
  "Vijay Nagar", "Palasia", "Scheme 78", "Bicholi Mardana", "Nipania",
  "Bhawarkuan", "Sudama Nagar", "Super Corridor", "Silicon City", "Rau",
];

export const BUY_TYPES = "resale,auction,distressed,builder";

export const LISTING_LABEL: Record<string, string> = {
  resale: "Resale",
  auction: "Bank auction",
  distressed: "Distressed deal",
  builder: "New project",
  rent: "For rent",
};

export const PTYPE_LABEL: Record<string, string> = {
  flat: "Flat",
  house: "House",
  villa: "Villa",
  plot: "Plot",
  commercial: "Commercial",
};

export const PTYPE_SLUGS = ["flat", "house", "villa", "plot", "commercial"];
export const FACINGS = ["East", "West", "North", "South"];

export const SALE_STEPS = [2_500_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 20_000_000, 30_000_000];
export const RENT_STEPS = [10_000, 15_000, 20_000, 30_000, 40_000, 50_000];

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
export const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
