import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuctionPanel from "@/components/AuctionPanel";
import { Badges } from "@/components/PropertyCard";
import PropertyCard from "@/components/PropertyCard";
import PropertyArt from "@/components/PropertyArt";
import LeadForm from "@/components/LeadForm";
import MapLazy from "@/components/MapLazy";
import ApiDown from "@/components/ApiDown";
import { Area, Bed, Check, Compass, Layers, Pin, Shield } from "@/components/Icons";
import { getLocalities, getProperty, getSimilar } from "@/lib/api";
import { CITY, PTYPE_LABEL, SITE_URL } from "@/lib/constants";
import { formatArea, formatDate, formatPrice, ordinal } from "@/lib/format";
import type { Property } from "@/lib/types";

export const dynamic = "force-dynamic";
type Props = { params: { city: string; slug: string } };

async function load(slug: string): Promise<Property | null | "down"> {
  try {
    return await getProperty(slug);
  } catch (e) {
    return e instanceof Error && e.message.includes("API 404") ? null : "down";
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load(params.slug);
  if (!p || p === "down") return {};
  const kind = p.listing_type === "rent" ? "for rent" : p.listing_type === "auction" ? "bank auction" : "for sale";
  return {
    title: `${p.title} ${kind}, ${formatPrice(p.price, p.listing_type)}`,
    description: `${p.title} ${kind} in ${p.locality}, Indore. ${formatArea(p.area_sqft)}, ${formatPrice(p.price, p.listing_type)}. ${p.description}`.slice(0, 300),
    alternates: { canonical: `/property/indore/${p.slug}` },
    openGraph: { title: p.title, description: p.description, type: "website" },
  };
}

export default async function Page({ params }: Props) {
  if (params.city !== CITY.slug) notFound();
  const p = await load(params.slug);
  if (p === "down") return <ApiDown />;
  if (!p) notFound();

  const [similar, localities] = await Promise.all([getSimilar(p.slug).catch(() => []), getLocalities().catch(() => [])]);
  const loc = localities.find((l) => l.name === p.locality);

  // Price check against the locality average (sale listings only)
  let priceCheck: { text: string; tone: "good" | "high" | "fair" } | null = null;
  if (p.price_per_sqft && loc?.avg_price_per_sqft && p.listing_type !== "rent" && p.listing_type !== "auction" && loc.count > 1) {
    const diff = Math.round(((p.price_per_sqft - loc.avg_price_per_sqft) / loc.avg_price_per_sqft) * 100);
    priceCheck = Math.abs(diff) < 5
      ? { tone: "fair", text: `In line with the ${p.locality} average of ₹${loc.avg_price_per_sqft.toLocaleString("en-IN")}/sq.ft` }
      : diff < 0
        ? { tone: "good", text: `${Math.abs(diff)}% below the ${p.locality} average of ₹${loc.avg_price_per_sqft.toLocaleString("en-IN")}/sq.ft` }
        : { tone: "high", text: `${diff}% above the ${p.locality} average of ₹${loc.avg_price_per_sqft.toLocaleString("en-IN")}/sq.ft` };
  }

  const facts: [string, string | null][] = [
    ["Property type", PTYPE_LABEL[p.property_type]],
    ["Area", formatArea(p.area_sqft)],
    ["Bedrooms", p.bedrooms ? `${p.bedrooms} BHK` : null],
    ["Bathrooms", p.bathrooms ? String(p.bathrooms) : null],
    ["Facing", p.facing],
    ["Floor", p.floor !== null && p.total_floors ? `${ordinal(p.floor)} of ${p.total_floors}` : p.total_floors ? `${p.total_floors} floors` : null],
    ["Age of property", p.age_years !== null ? (p.age_years === 0 ? "New construction" : `${p.age_years} years`) : null],
    ["Furnishing", p.furnishing],
    ["Possession", p.possession],
    ["Listed by", p.posted_by === "bank" ? "Bank" : p.posted_by[0].toUpperCase() + p.posted_by.slice(1)],
    ["Listed on", formatDate(p.created_at)],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    url: `${SITE_URL}/property/indore/${p.slug}`,
    datePosted: p.created_at,
    offers: { "@type": "Offer", price: p.price, priceCurrency: "INR" },
    about: {
      "@type": "Residence",
      floorSize: { "@type": "QuantitativeValue", value: p.area_sqft, unitCode: "FTK" },
      address: { "@type": "PostalAddress", addressLocality: p.locality, addressRegion: "Madhya Pradesh", addressCountry: "IN" },
      geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
    },
  };

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
        <Link href="/" className="hover:text-narmada-700">Home</Link> / <Link href="/properties/indore" className="hover:text-narmada-700">Indore</Link> /{" "}
        <Link href={`/properties/indore/${p.locality.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="hover:text-narmada-700">{p.locality}</Link>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-8">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative aspect-[16/9] max-h-[460px] w-full">
              <PropertyArt id={p.id} type={p.property_type} />
              <div className="absolute left-4 top-4"><Badges p={p} /></div>
            </div>
            <div className="p-5 sm:p-6">
              <h1 className="font-display text-[28px] font-bold leading-tight text-narmada-900 sm:text-[34px]">{p.title}</h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-muted"><Pin width={16} height={16} /> {p.address}</p>
              <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-2">
                <div>
                  <p className="text-[13px] text-muted">{p.listing_type === "auction" ? "Reserve price" : p.listing_type === "rent" ? "Monthly rent" : "Price"}</p>
                  <p className="font-display text-[36px] font-bold leading-none text-narmada-900">{formatPrice(p.price, p.listing_type)}</p>
                </div>
                {p.price_per_sqft && <p className="pb-1 text-[15px] text-muted">₹{p.price_per_sqft.toLocaleString("en-IN")} per sq.ft</p>}
              </div>
              {priceCheck && (
                <p className={`mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] font-semibold ${priceCheck.tone === "good" ? "bg-narmada-50 text-narmada-700" : priceCheck.tone === "high" ? "bg-marigold-100 text-marigold-700" : "bg-paper text-ink"}`}>
                  <Shield width={16} height={16} /> {priceCheck.text}
                </p>
              )}
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 text-[15px]">
                {p.bedrooms ? <li className="inline-flex items-center gap-2"><Bed /> {p.bedrooms} BHK</li> : null}
                <li className="inline-flex items-center gap-2"><Area /> {formatArea(p.area_sqft)}</li>
                {p.facing && <li className="inline-flex items-center gap-2"><Compass /> {p.facing} facing</li>}
                {p.floor !== null && p.total_floors ? <li className="inline-flex items-center gap-2"><Layers /> {ordinal(p.floor)} of {p.total_floors} floors</li> : null}
              </ul>
            </div>
          </div>

          {p.listing_type === "auction" && <AuctionPanel p={p} />}

          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-narmada-900">About this property</h2>
            <p className="mt-3 max-w-prose leading-relaxed text-ink/90">{p.description}</p>
            <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {facts.filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-line pb-3 text-[15px]">
                  <dt className="text-muted">{k}</dt><dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {p.amenities.length > 0 && (
            <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold text-narmada-900">Amenities</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {p.amenities.map((a) => <li key={a} className="inline-flex items-center gap-2 text-[15px]"><Check className="text-narmada-600" width={17} height={17} /> {a}</li>)}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-narmada-900">Location</h2>
            <p className="mt-1 text-[14px] text-muted">The pin shows the locality area, not the exact address.</p>
            <MapLazy items={[p]} single className="mt-4 h-[320px]" />
          </section>
        </div>

        <aside id="contact" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_16px_40px_-24px_rgba(11,42,38,0.35)] sm:p-6">
            <p className="font-display text-[26px] font-bold text-narmada-900">{formatPrice(p.price, p.listing_type)}</p>
            <h2 className="mt-3 font-display text-[17px] font-semibold text-narmada-900">
              {p.listing_type === "auction" ? "Get help with this auction" : p.posted_by === "owner" ? "Contact the owner" : "Contact the seller"}
            </h2>
            <p className="mb-4 mt-1 text-[14px] text-muted">
              {p.listing_type === "auction" ? "We can walk you through the notice and what to verify." : "Share your number and we will connect you."}
            </p>
            <LeadForm slug={p.slug} title={p.title} kind={p.listing_type === "auction" ? "assistance" : "buyer"}
              cta={p.listing_type === "auction" ? "Request assistance" : "Get phone number"} />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-narmada-900">Similar properties</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => <PropertyCard key={s.id} p={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
