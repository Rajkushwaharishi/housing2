import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatArea, formatPrice, ordinal } from "@/lib/format";
import { LISTING_LABEL, PTYPE_LABEL } from "@/lib/constants";
import PropertyArt from "./PropertyArt";
import { Area, Bed, Check, Compass, Layers, Pin } from "./Icons";

export function Badges({ p }: { p: Property }) {
  const tone: Record<string, string> = {
    auction: "bg-brick-600 text-white",
    distressed: "bg-marigold-500 text-narmada-900",
    builder: "bg-narmada-700 text-white",
    resale: "bg-white text-narmada-900",
    rent: "bg-white text-narmada-900",
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className={`rounded-md px-2 py-1 text-[12px] font-semibold shadow-sm ${tone[p.listing_type]}`}>
        {LISTING_LABEL[p.listing_type]}
      </span>
      {p.verified && (
        <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[12px] font-semibold text-narmada-700 shadow-sm">
          <Check width={13} height={13} strokeWidth={2.6} /> Verified
        </span>
      )}
    </div>
  );
}

function Facts({ p }: { p: Property }) {
  const items: { icon: JSX.Element; text: string }[] = [];
  if (p.bedrooms) items.push({ icon: <Bed width={16} height={16} />, text: `${p.bedrooms} BHK` });
  items.push({ icon: <Area width={16} height={16} />, text: formatArea(p.area_sqft) });
  if (p.facing) items.push({ icon: <Compass width={16} height={16} />, text: `${p.facing} facing` });
  if (p.floor !== null && p.total_floors) items.push({ icon: <Layers width={16} height={16} />, text: `${ordinal(p.floor)} of ${p.total_floors}` });
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[14px] text-muted">
      {items.map((i) => (
        <li key={i.text} className="inline-flex items-center gap-1.5">{i.icon}{i.text}</li>
      ))}
    </ul>
  );
}

export default function PropertyCard({ p, variant = "grid" }: { p: Property; variant?: "grid" | "row" }) {
  const href = `/property/indore/${p.slug}`;
  const row = variant === "row";
  return (
    <article className={`group overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-[0_10px_30px_-12px_rgba(11,42,38,0.25)] ${row ? "sm:grid sm:grid-cols-[300px_1fr]" : ""}`}>
      <Link href={href} className={`relative block overflow-hidden ${row ? "aspect-[4/3] sm:aspect-auto sm:min-h-[220px]" : "aspect-[4/3]"}`} aria-label={p.title}>
        <PropertyArt id={p.id} type={p.property_type} />
        <div className="absolute left-3 top-3"><Badges p={p} /></div>
      </Link>
      <div className="flex flex-col p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-[26px] font-bold leading-none text-narmada-900">
            {formatPrice(p.price, p.listing_type)}
          </p>
          {p.price_per_sqft && <p className="text-[13px] text-muted">₹{p.price_per_sqft.toLocaleString("en-IN")}/sq.ft</p>}
        </div>
        {p.discount_pct ? (
          <p className="mt-1.5 text-[13px] font-semibold text-brick-600">
            {p.discount_pct}% below market value of {formatPrice(p.market_price!)}
          </p>
        ) : null}
        <h3 className="mt-3 text-[17px] font-semibold leading-snug text-ink">
          <Link href={href} className="hover:text-narmada-700">{p.title}</Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-[14px] text-muted">
          <Pin width={15} height={15} /> {p.locality}, Indore
          <span className="text-line">|</span> {PTYPE_LABEL[p.property_type]}
        </p>
        <div className="mt-3"><Facts p={p} /></div>
        {row && <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-muted">{p.description}</p>}
        <div className={`mt-4 flex items-center gap-2 ${row ? "sm:mt-auto sm:pt-4" : ""}`}>
          <Link href={href} className="rounded-xl bg-narmada-900 px-4 py-2 text-[14px] font-semibold text-white hover:bg-narmada-800">
            View details
          </Link>
          <Link href={`${href}#contact`} className="rounded-xl border border-line px-4 py-2 text-[14px] font-semibold text-narmada-900 hover:bg-narmada-50">
            Contact
          </Link>
        </div>
      </div>
    </article>
  );
}
