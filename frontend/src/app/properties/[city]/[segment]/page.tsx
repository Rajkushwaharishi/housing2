import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/ListingPage";
import { getLocalities } from "@/lib/api";
import { CITY, PTYPE_LABEL, PTYPE_SLUGS } from "@/lib/constants";

export const dynamic = "force-dynamic";
type Props = { params: { city: string; segment: string }; searchParams: Record<string, string | undefined> };

const PLURAL: Record<string, string> = { flat: "Flats", house: "Houses", villa: "Villas", plot: "Plots", commercial: "Commercial property" };

async function resolve(segment: string) {
  if (PTYPE_SLUGS.includes(segment)) return { kind: "ptype" as const, ptype: segment };
  const locs = await getLocalities().catch(() => []);
  const loc = locs.find((l) => l.slug === segment);
  return loc ? { kind: "locality" as const, name: loc.name } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await resolve(params.segment);
  if (!r) return {};
  const canonical = `/properties/indore/${params.segment}`;
  if (r.kind === "ptype") {
    return { title: `${PLURAL[r.ptype]} for sale in Indore`, description: `${PLURAL[r.ptype]} for sale in Indore with price per sq.ft, locality and verification details.`, alternates: { canonical } };
  }
  return { title: `Property in ${r.name}, Indore: flats, houses, plots`, description: `Flats, houses and plots for sale in ${r.name}, Indore, with price per sq.ft and locality averages.`, alternates: { canonical } };
}

export default async function Page({ params, searchParams }: Props) {
  if (params.city !== CITY.slug) notFound();
  const r = await resolve(params.segment);
  if (!r) notFound();
  if (r.kind === "ptype") {
    return <ListingPage basePath={`/properties/indore/${params.segment}`} searchParams={searchParams}
      preset={{ ptype: r.ptype }} heading={`${PLURAL[r.ptype]} for sale in Indore`}
      intro={`Compare ${PTYPE_LABEL[r.ptype].toLowerCase()} listings across Indore by locality, size and price per sq.ft.`} />;
  }
  return <ListingPage basePath={`/properties/indore/${params.segment}`} searchParams={searchParams}
    preset={{ locality: r.name }} heading={`Property in ${r.name}, Indore`}
    intro={`Flats, houses and plots in ${r.name}.`} />;
}
