import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/ListingPage";
import { CITY } from "@/lib/constants";

export const dynamic = "force-dynamic";
type Props = { params: { city: string }; searchParams: Record<string, string | undefined> };

export const metadata: Metadata = {
  title: "Bank auction properties in Indore",
  description: "Upcoming bank auction properties in Indore with reserve price, earnest money, auction date and a checklist to verify before you bid.",
  alternates: { canonical: "/bank-auction-properties/indore" },
};

export default function Page({ params, searchParams }: Props) {
  if (params.city !== CITY.slug) notFound();
  return (
    <>
      <ListingPage basePath="/bank-auction-properties/indore" searchParams={searchParams} preset={{ type: "auction" }}
        lockedType heading="Bank auction properties in Indore"
        intro="Auction properties are sold by banks to recover dues. Reserve prices are often below market value, but each property needs its own checks. Read the full auction notice and verify title, possession, dues, litigation and auction terms independently before you bid." />
    </>
  );
}
