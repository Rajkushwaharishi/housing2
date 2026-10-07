import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/ListingPage";
import { CITY } from "@/lib/constants";

export const dynamic = "force-dynamic";
type Props = { params: { city: string }; searchParams: Record<string, string | undefined> };

export function generateMetadata({ searchParams }: Props): Metadata {
  const rent = searchParams.type === "rent";
  return {
    title: rent ? "Flats and houses for rent in Indore" : "Property for sale in Indore: flats, houses, plots",
    description: rent ? "Rental flats and houses in Indore with furnishing, floor and locality details." : "Browse verified flats, independent houses, plots, distressed deals and bank auctions in Indore.",
    alternates: { canonical: "/properties/indore" },
  };
}

export default function Page({ params, searchParams }: Props) {
  if (params.city !== CITY.slug) notFound();
  const rent = searchParams.type === "rent";
  return (
    <ListingPage basePath="/properties/indore" searchParams={searchParams}
      heading={rent ? "Property for rent in Indore" : "Property for sale in Indore"}
      intro="Browse homes, plots and deals across Indore." />
  );
}
