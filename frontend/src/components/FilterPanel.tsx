"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Locality } from "@/lib/types";
import { FACINGS, LISTING_LABEL, PTYPE_LABEL, RENT_STEPS, SALE_STEPS } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

interface Props {
  basePath: string;
  current: Record<string, string | undefined>;
  localities: Locality[];
  lockedType?: boolean;
}

const TYPE_OPTIONS = [
  ["", "All for sale"], ["resale", LISTING_LABEL.resale], ["builder", LISTING_LABEL.builder],
  ["distressed", LISTING_LABEL.distressed], ["auction", LISTING_LABEL.auction], ["rent", LISTING_LABEL.rent],
];

export default function FilterPanel({ basePath, current, localities, lockedType }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const isRent = current.type === "rent";
  const steps = isRent ? RENT_STEPS : SALE_STEPS;

  function push(patch: Record<string, string | null>) {
    const merged: Record<string, string | null | undefined> = { ...current, ...patch, page: null };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const qs = p.toString();
    start(() => router.push(qs ? `${basePath}?${qs}` : basePath));
  }

  const bhks = (current.bhk || "").split(",").filter(Boolean);
  const toggleBhk = (n: string) => push({ bhk: (bhks.includes(n) ? bhks.filter((x) => x !== n) : [...bhks, n]).join(",") || null });

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-colors ${on ? "border-narmada-900 bg-narmada-900 text-white" : "border-line bg-white text-ink hover:border-narmada-600"}`;
  const sel = "h-10 w-full rounded-lg border border-line bg-white px-2.5 text-[14px] focus:border-narmada-600";

  return (
    <div className={`space-y-6 ${pending ? "opacity-70" : ""}`} aria-busy={pending}>
      {!lockedType && (
        <fieldset>
          <legend className="mb-2 font-display text-[15px] font-semibold text-narmada-900">Listing type</legend>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map(([v, l]) => (
              <button key={v} type="button" onClick={() => push({ type: v || null, min: null, max: null })}
                className={chip((current.type || "") === v)} aria-pressed={(current.type || "") === v}>{l}</button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-2 font-display text-[15px] font-semibold text-narmada-900">Property type</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(!current.ptype)} onClick={() => push({ ptype: null })}>Any</button>
          {Object.entries(PTYPE_LABEL).map(([v, l]) => (
            <button key={v} type="button" className={chip(current.ptype === v)} aria-pressed={current.ptype === v}
              onClick={() => push({ ptype: current.ptype === v ? null : v })}>{l}</button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-display text-[15px] font-semibold text-narmada-900">Bedrooms (BHK)</legend>
        <div className="flex flex-wrap gap-2">
          {["1", "2", "3", "4"].map((n) => (
            <button key={n} type="button" className={chip(bhks.includes(n))} aria-pressed={bhks.includes(n)} onClick={() => toggleBhk(n)}>
              {n === "4" ? "4+" : n}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-display text-[15px] font-semibold text-narmada-900">{isRent ? "Monthly rent" : "Budget"}</legend>
        <div className="grid grid-cols-2 gap-2">
          <label><span className="sr-only">Minimum</span>
            <select className={sel} value={current.min || ""} onChange={(e) => push({ min: e.target.value || null })}>
              <option value="">Min</option>
              {steps.map((s) => <option key={s} value={s}>{formatPrice(s, isRent ? "rent" : undefined)}</option>)}
            </select>
          </label>
          <label><span className="sr-only">Maximum</span>
            <select className={sel} value={current.max || ""} onChange={(e) => push({ max: e.target.value || null })}>
              <option value="">Max</option>
              {steps.map((s) => <option key={s} value={s}>{formatPrice(s, isRent ? "rent" : undefined)}</option>)}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-display text-[15px] font-semibold text-narmada-900">Locality</legend>
        <select className={sel} value={current.locality || ""} onChange={(e) => push({ locality: e.target.value || null })}>
          <option value="">All of Indore</option>
          {[...localities].sort((a, b) => a.name.localeCompare(b.name)).map((l) => <option key={l.slug} value={l.name}>{l.name} ({l.count})</option>)}
        </select>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-display text-[15px] font-semibold text-narmada-900">Facing</legend>
        <select className={sel} value={current.facing || ""} onChange={(e) => push({ facing: e.target.value || null })}>
          <option value="">Any direction</option>
          {FACINGS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white px-3 py-2.5 text-[15px]">
        <input type="checkbox" className="h-4 w-4 accent-narmada-700" checked={current.verified === "1"}
          onChange={(e) => push({ verified: e.target.checked ? "1" : null })} />
        Verified listings only
      </label>

      <button type="button" onClick={() => start(() => router.push(basePath))}
        className="text-[14px] font-semibold text-narmada-700 underline underline-offset-4 hover:text-narmada-900">
        Clear all filters
      </button>
    </div>
  );
}
