import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatArea, formatDate, formatPrice } from "@/lib/format";
import { PTYPE_LABEL } from "@/lib/constants";
import Countdown from "./Countdown";
import { Gavel, Pin } from "./Icons";

export default function AuctionCard({ p }: { p: Property }) {
  const href = `/property/indore/${p.slug}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white">
      <div className="flex items-center justify-between bg-brick-600 px-5 py-2.5 text-white">
        <span className="inline-flex items-center gap-2 text-[14px] font-semibold"><Gavel width={16} height={16} /> Bank auction</span>
        <span className="rounded-md bg-white/15 px-2 py-0.5 text-[13px] font-semibold">
          {p.auction_date ? <Countdown iso={p.auction_date} /> : "Date to be announced"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[18px] font-semibold leading-snug text-ink">
          <Link href={href} className="hover:text-narmada-700">{p.title}</Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-[14px] text-muted">
          <Pin width={15} height={15} /> {p.locality}, Indore <span className="text-line">|</span> {PTYPE_LABEL[p.property_type]}, {formatArea(p.area_sqft)}
        </p>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[13px] text-muted">Reserve price</p>
            <p className="font-display text-[28px] font-bold leading-tight text-narmada-900">{formatPrice(p.price)}</p>
            {p.market_price && <p className="text-[13px] text-muted line-through">{formatPrice(p.market_price)} est. market value</p>}
          </div>
          {p.discount_pct ? (
            <p className="rounded-lg bg-brick-50 px-3 py-2 text-center text-brick-700">
              <span className="block font-display text-[22px] font-bold leading-none">{p.discount_pct}%</span>
              <span className="text-[12px] font-semibold">below market</span>
            </p>
          ) : null}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-[14px]">
          <div><dt className="text-muted">Earnest money</dt><dd className="font-semibold">{p.emd ? formatPrice(p.emd) : "As per notice"}</dd></div>
          <div><dt className="text-muted">Auction date</dt><dd className="font-semibold">{p.auction_date ? formatDate(p.auction_date) : "TBA"}</dd></div>
        </dl>
        <Link href={href} className="mt-5 rounded-xl bg-narmada-900 px-4 py-2.5 text-center text-[15px] font-semibold text-white hover:bg-narmada-800">
          View auction details
        </Link>
      </div>
    </article>
  );
}
