import Link from "next/link";
import ApiDown from "@/components/ApiDown";
import AuctionCard from "@/components/AuctionCard";
import LocalityMap from "@/components/LocalityMap";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { Building, Chevron, Gavel, Home, Key, Plot, Shield, Tag } from "@/components/Icons";
import { getLocalities, getProperties, getStats } from "@/lib/api";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { href: "/properties/indore/flat", label: "Flats", Icon: Building },
  { href: "/properties/indore/house", label: "Houses", Icon: Home },
  { href: "/properties/indore/plot", label: "Plots", Icon: Plot },
  { href: "/bank-auction-properties/indore", label: "Bank auctions", Icon: Gavel },
  { href: "/properties/indore?type=distressed", label: "Distressed deals", Icon: Tag },
  { href: "/properties/indore?type=rent", label: "Rent", Icon: Key },
];

export default async function HomePage() {
  const [stats, locs, auctions, fresh] = await Promise.all([
    getStats().catch(() => null),
    getLocalities().catch(() => null),
    getProperties("listing_type=auction&sort=soonest&page_size=3").catch(() => null),
    getProperties("listing_type=resale,builder,distressed&sort=newest&page_size=6").catch(() => null),
  ]);
  if (!stats || !locs || !auctions || !fresh) return <ApiDown />;
  const maxPpsf = Math.max(...locs.map((l) => l.avg_price_per_sqft || 0), 1);
  const byPrice = [...locs].sort((a, b) => (b.avg_price_per_sqft || 0) - (a.avg_price_per_sqft || 0));

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-page items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-16">
          <div>
            <h1 className="font-display text-[40px] font-extrabold leading-[1.05] tracking-tight text-narmada-900 sm:text-[56px]">
              Find your next property in Indore
            </h1>
            <p className="mt-5 max-w-lg text-[18px] leading-relaxed text-muted">
              Resale homes, plots and bank auction deals, each with its price checked against the locality average.
            </p>
            <div className="mt-8"><SearchBar /></div>
            <p className="mt-5 text-[14px] text-muted">
              Popular:{" "}
              {byPrice.slice(0, 4).map((l, i) => (
                <span key={l.slug}>{i > 0 && ", "}<Link href={`/properties/indore/${l.slug}`} className="font-semibold text-narmada-700 underline underline-offset-4 hover:text-narmada-900">{l.name}</Link></span>
              ))}
            </p>
          </div>
          <div className="rounded-3xl bg-narmada-50 p-4 sm:p-6">
            <h2 className="font-display text-lg font-bold text-narmada-900">What property costs across Indore</h2>
            <p className="mb-2 text-[14px] text-muted">Select a locality to see what's listed there.</p>
            <LocalityMap localities={locs} />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-page px-4 pt-10 sm:px-6" aria-label="Browse by category">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ href, label, Icon }) => (
            <li key={label}>
              <Link href={href} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 font-semibold text-narmada-900 hover:border-narmada-600">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-narmada-50 text-narmada-700"><Icon width={20} height={20} /></span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Auctions */}
      <section className="mt-14 bg-narmada-900 py-14" aria-labelledby="auction-title">
        <div className="mx-auto max-w-page px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="auction-title" className="font-display text-[32px] font-bold leading-tight text-white">Bank auctions closing soon</h2>
              <p className="mt-2 max-w-xl text-narmada-200">Reserve prices, earnest money and dates in one place. Every auction page includes a checklist of what to verify before you bid.</p>
            </div>
            <Link href="/bank-auction-properties/indore" className="inline-flex items-center gap-1 rounded-xl bg-marigold-500 px-5 py-2.5 font-semibold text-narmada-900 hover:bg-marigold-400">
              All {stats.auctions} auctions <Chevron width={17} height={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {auctions.items.map((p) => <AuctionCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Fresh listings */}
      <section className="mx-auto max-w-page px-4 pt-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[30px] font-bold text-narmada-900">New in Indore</h2>
          <Link href="/properties/indore" className="inline-flex items-center gap-1 font-semibold text-narmada-700 hover:text-narmada-900">View all <Chevron width={17} height={17} /></Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fresh.items.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Localities compared */}
      <section id="localities" className="mx-auto max-w-page px-4 pt-16 sm:px-6">
        <h2 className="font-display text-[30px] font-bold text-narmada-900">Compare localities by price</h2>
        <p className="mt-2 max-w-xl text-muted">Average asking price per sq.ft across active listings, highest first.</p>
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {byPrice.map((l) => (
            <li key={l.slug}>
              <Link href={`/properties/indore/${l.slug}`} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-narmada-50 sm:grid-cols-[200px_1fr_120px_24px]">
                <span className="font-semibold text-ink">{l.name}</span>
                <span className="order-last col-span-2 h-2 overflow-hidden rounded-full bg-narmada-50 sm:order-none sm:col-span-1" aria-hidden="true">
                  <span className="block h-full rounded-full bg-narmada-600" style={{ width: `${((l.avg_price_per_sqft || 0) / maxPpsf) * 100}%` }} />
                </span>
                <span className="text-right text-[15px]"><strong className="font-semibold">₹{(l.avg_price_per_sqft || 0).toLocaleString("en-IN")}</strong><span className="text-muted">/sq.ft</span></span>
                <span className="hidden text-narmada-600 sm:block"><Chevron width={18} height={18} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-page px-4 pt-16 sm:px-6">
        <h2 className="font-display text-[30px] font-bold text-narmada-900">How we help you decide</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            { Icon: Shield, t: "Reviewed before going live", d: "Every new listing is checked by our team. Verified listings carry a badge once documents and ownership details are confirmed." },
            { Icon: Tag, t: "Price checked against the locality", d: "Each listing shows its price per sq.ft next to the locality average, so you can see if an ask is high or fair." },
            { Icon: Gavel, t: "Auction checklist on every notice", d: "Title, possession, dues, litigation and auction terms: what to check before you put in earnest money." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-line bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-narmada-900 text-marigold-400"><Icon width={22} height={22} /></span>
              <h3 className="mt-4 font-display text-[19px] font-semibold text-narmada-900">{t}</h3>
              <p className="mt-2 leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="mx-auto mt-16 max-w-page px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-marigold-500 px-8 py-10">
          <div>
            <h2 className="font-display text-[30px] font-bold leading-tight text-narmada-900">Selling or renting out in Indore?</h2>
            <p className="mt-2 max-w-lg text-narmada-900/80">List your flat, house or plot for free. Buyers send enquiries and you decide who to talk to.</p>
          </div>
          <Link href="/post-property" className="rounded-xl bg-narmada-900 px-7 py-3.5 text-[16px] font-bold text-white hover:bg-narmada-800">Post your property</Link>
        </div>
      </section>
    </>
  );
}
