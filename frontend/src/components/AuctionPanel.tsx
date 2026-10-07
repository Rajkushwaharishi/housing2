import type { Property } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/format";
import Countdown from "./Countdown";
import { Check, Gavel } from "./Icons";

const POSSESSION: Record<string, string> = {
  symbolic: "Symbolic possession (bank holds paper possession; occupant may still be inside)",
  physical: "Physical possession (stated in the notice)",
  unknown: "Not stated. Confirm with the bank before bidding",
};

const CHECKLIST = [
  ["Title and encumbrances", "Get a title search for at least 30 years and check for existing charges."],
  ["Possession status", "Ask whether you will get physical or symbolic possession, and who is in the property."],
  ["Dues", "Check property tax, society maintenance, electricity and water dues. They often pass to the buyer."],
  ["Litigation", "Search court records for cases on the property or against the borrower."],
  ["Auction terms", "Read the full sale notice: inspection dates, earnest money, payment timeline and what happens if you withdraw."],
];

export default function AuctionPanel({ p }: { p: Property }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-brick-100 bg-white" aria-labelledby="auction-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brick-600 px-5 py-3 text-white sm:px-6">
        <h2 id="auction-heading" className="inline-flex items-center gap-2 font-display text-lg font-bold"><Gavel width={19} height={19} /> Auction details</h2>
        {p.auction_date && <span className="rounded-md bg-white/15 px-2.5 py-1 text-[14px] font-semibold"><Countdown iso={p.auction_date} /></span>}
      </div>
      <div className="p-5 sm:p-6">
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Row k="Reserve price" v={formatPrice(p.price)} />
          {p.market_price && <Row k="Estimated market value" v={`${formatPrice(p.market_price)}${p.discount_pct ? ` (${p.discount_pct}% above reserve)` : ""}`} />}
          <Row k="Earnest money deposit" v={p.emd ? formatPrice(p.emd) : "As per notice"} />
          <Row k="Auction date" v={p.auction_date ? formatDate(p.auction_date, true) : "To be announced"} />
          <Row k="Bank" v={p.bank_name || "As per notice"} />
          <Row k="Possession" v={p.possession_type ? POSSESSION[p.possession_type] : "To be verified"} />
        </dl>

        <h3 className="mt-7 font-display text-[17px] font-semibold text-narmada-900">Verify before you bid</h3>
        <ul className="mt-3 space-y-3">
          {CHECKLIST.map(([t, d]) => (
            <li key={t} className="flex gap-3 text-[15px]">
              <Check className="mt-0.5 shrink-0 text-narmada-600" width={18} height={18} />
              <span><strong className="font-semibold">{t}.</strong> <span className="text-muted">{d}</span></span>
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-lg bg-marigold-100 p-3.5 text-[14px] leading-relaxed text-marigold-700">
          Auction properties require independent verification of title, possession, dues, litigation and auction terms. The market value shown is our estimate, not a valuation.
        </p>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-b border-line pb-3 text-[15px]">
      <dt className="text-muted">{k}</dt>
      <dd className="mt-0.5 font-semibold">{v}</dd>
    </div>
  );
}
