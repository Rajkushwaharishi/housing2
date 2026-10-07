import type { MetadataRoute } from "next";
import { getLocalities, getSlugs } from "@/lib/api";
import { PTYPE_SLUGS, SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, locs] = await Promise.all([getSlugs().catch(() => []), getLocalities().catch(() => [])]);
  const fixed = ["", "/properties/indore", "/bank-auction-properties/indore", "/post-property"].map((p) => ({ url: `${SITE_URL}${p}` }));
  const segments = [...PTYPE_SLUGS, ...locs.map((l) => l.slug)].map((s) => ({ url: `${SITE_URL}/properties/indore/${s}` }));
  const props = slugs.map((s) => ({ url: `${SITE_URL}/property/indore/${s.slug}`, lastModified: s.updated }));
  return [...fixed, ...segments, ...props];
}
