import type { Locality, Property, PropertyList, Stats } from "./types";

const BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function get<T>(path: string, revalidate = 30): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return res.json();
}

export type SearchParams = Record<string, string | undefined>;

/** Maps URL search params (short names) to API query params. */
export function toApiQuery(sp: SearchParams, extra: Record<string, string> = {}): string {
  const q = new URLSearchParams();
  const map: Record<string, string> = {
    type: "listing_type", ptype: "property_type", locality: "locality", bhk: "bhk",
    min: "min_price", max: "max_price", facing: "facing", verified: "verified",
    sort: "sort", q: "q", page: "page",
  };
  for (const [k, apiKey] of Object.entries(map)) {
    const v = sp[k];
    if (v) q.set(apiKey, v);
  }
  for (const [k, v] of Object.entries(extra)) q.set(k, v);
  return q.toString();
}

export const getProperties = (query: string) => get<PropertyList>(`/api/properties?${query}`);
export const getProperty = (slug: string) => get<Property>(`/api/properties/${slug}`);
export const getSimilar = (slug: string) => get<Property[]>(`/api/properties/${slug}/similar`);
export const getLocalities = () => get<Locality[]>("/api/localities", 60);
export const getStats = () => get<Stats>("/api/stats", 60);
export const getSlugs = () => get<{ slug: string; updated: string }[]>("/api/slugs", 300);
