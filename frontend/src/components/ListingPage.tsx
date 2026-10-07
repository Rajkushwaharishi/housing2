import Link from "next/link";
import { getLocalities, getProperties, toApiQuery, type SearchParams } from "@/lib/api";
import { BUY_TYPES } from "@/lib/constants";
import ApiDown from "./ApiDown";
import FilterPanel from "./FilterPanel";
import MapLazy from "./MapLazy";
import PropertyCard from "./PropertyCard";
import SortSelect from "./SortSelect";
import { Filter, List, Map } from "./Icons";

interface Props {
  basePath: string;
  searchParams: SearchParams;
  preset?: { locality?: string; ptype?: string; type?: string };
  heading: string;
  lockedType?: boolean;
  sortOptions?: [string, string][];
  intro?: string;
}

const DEFAULT_SORTS: [string, string][] = [
  ["newest", "Newest first"], ["price_asc", "Price: low to high"], ["price_desc", "Price: high to low"],
];
const AUCTION_SORTS: [string, string][] = [
  ["soonest", "Auction date: soonest"], ["discount", "Biggest discount"], ["price_asc", "Price: low to high"],
];

export default async function ListingPage({ basePath, searchParams, preset = {}, heading, lockedType, sortOptions, intro }: Props) {
  // Preset values (from the URL path) win over query-string values.
  const sp: SearchParams = { ...searchParams, ...preset };
  const auctionOnly = sp.type === "auction";
  const apiType = sp.type && sp.type !== "buy" ? sp.type : BUY_TYPES;
  const sorts = sortOptions ?? (auctionOnly ? AUCTION_SORTS : DEFAULT_SORTS);
  const query = toApiQuery({ ...sp, sort: sp.sort || sorts[0][0] }, { listing_type: apiType, page_size: "10" });

  const [data, localities] = await Promise.all([
    getProperties(query).catch(() => null),
    getLocalities().catch(() => []),
  ]);
  if (!data) return <ApiDown />;

  const current: Record<string, string | undefined> = {};
  for (const k of ["type", "ptype", "bhk", "locality", "min", "max", "facing", "verified", "sort", "q", "view"]) {
    if (sp[k]) current[k] = sp[k];
  }
  const mapView = sp.view === "map";
  const hrefWith = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...current, ...patch })) if (v) p.set(k, v);
    const qs = p.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const page = data.page;
  const loc = localities.find((l) => l.name === sp.locality);

  const filters = <FilterPanel basePath={basePath} current={current} localities={localities} lockedType={lockedType} />;

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
        <Link href="/" className="hover:text-narmada-700">Home</Link> / <Link href="/properties/indore" className="hover:text-narmada-700">Indore</Link>
        {sp.locality && <> / <span className="text-ink">{sp.locality}</span></>}
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold leading-tight text-narmada-900 sm:text-[36px]">{heading}</h1>
          <p className="mt-1 text-muted">
            {data.total} {data.total === 1 ? "property" : "properties"} found
            {loc?.avg_price_per_sqft ? <> · average ₹{loc.avg_price_per_sqft.toLocaleString("en-IN")} per sq.ft in {loc.name}</> : null}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SortSelect basePath={basePath} current={current} options={sorts} />
          <div className="inline-flex overflow-hidden rounded-lg border border-line bg-white text-[14px] font-semibold">
            <Link href={hrefWith({ view: undefined })} className={`inline-flex items-center gap-1.5 px-3 py-2 ${!mapView ? "bg-narmada-900 text-white" : "text-ink hover:bg-narmada-50"}`}><List width={16} height={16} /> List</Link>
            <Link href={hrefWith({ view: "map" })} className={`inline-flex items-center gap-1.5 px-3 py-2 ${mapView ? "bg-narmada-900 text-white" : "text-ink hover:bg-narmada-50"}`}><Map width={16} height={16} /> Map</Link>
          </div>
        </div>
      </div>

      <div className={`mt-6 grid gap-6 ${mapView ? "" : "lg:grid-cols-[290px_minmax(0,1fr)]"}`}>
        {mapView ? (
          <details className="rounded-2xl border border-line bg-white p-4 open:pb-5">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-[16px] font-semibold text-narmada-900"><Filter width={18} height={18} /> Filters</summary>
            <div className="mt-4 max-w-md">{filters}</div>
          </details>
        ) : (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <details className="rounded-2xl border border-line bg-white p-4 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-[16px] font-semibold text-narmada-900"><Filter width={18} height={18} /> Filters</summary>
              <div className="mt-4">{filters}</div>
            </details>
            <div className="hidden rounded-2xl border border-line bg-white p-5 lg:block">{filters}</div>
          </aside>
        )}

        <div className={mapView ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : ""}>
          <div className="space-y-4">
            {data.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
                <h2 className="font-display text-xl font-bold text-narmada-900">No properties match these filters</h2>
                <p className="mt-2 text-muted">Try a wider budget, fewer bedrooms, or another locality.</p>
                <Link href={basePath} className="mt-5 inline-block rounded-xl bg-narmada-900 px-5 py-2.5 font-semibold text-white">Clear filters</Link>
              </div>
            ) : (
              data.items.map((p) => <PropertyCard key={p.id} p={p} variant="row" />)
            )}

            {data.pages > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-between pt-2 text-[15px]">
                {page > 1 ? <Link href={hrefWith({ page: String(page - 1) })} className="rounded-lg border border-line bg-white px-4 py-2 font-semibold hover:bg-narmada-50">Previous</Link> : <span />}
                <span className="text-muted">Page {page} of {data.pages}</span>
                {page < data.pages ? <Link href={hrefWith({ page: String(page + 1) })} className="rounded-lg border border-line bg-white px-4 py-2 font-semibold hover:bg-narmada-50">Next</Link> : <span />}
              </nav>
            )}
          </div>
          {mapView && (
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:self-start">
              <MapLazy items={data.items} className="h-[420px] lg:h-full" />
            </div>
          )}
        </div>
      </div>

      {(intro || loc) && (
        <section className="mt-12 max-w-3xl border-t border-line pt-8">
          <h2 className="font-display text-xl font-bold text-narmada-900">
            {sp.locality ? `About property in ${sp.locality}, Indore` : "About this search"}
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            {intro}
            {loc?.avg_price_per_sqft ? ` Homes and plots listed in ${loc.name} currently average ₹${loc.avg_price_per_sqft.toLocaleString("en-IN")} per sq.ft across ${loc.count} active listings.` : ""}
            {" "}Every listing shows its price per sq.ft so you can compare across localities, and auction listings show the reserve price against our estimate of market value.
          </p>
        </section>
      )}
    </div>
  );
}
