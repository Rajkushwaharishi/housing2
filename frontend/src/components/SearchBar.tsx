"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOCALITY_NAMES } from "@/lib/constants";
import { Search } from "./Icons";

const TABS = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "plot", label: "Plots" },
  { id: "auction", label: "Bank auction" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const SALE_BUDGETS: [string, string][] = [
  ["", "Any budget"], ["0-5000000", "Under ₹50 Lakh"], ["5000000-10000000", "₹50 Lakh to ₹1 Cr"],
  ["10000000-20000000", "₹1 Cr to ₹2 Cr"], ["20000000-", "Above ₹2 Cr"],
];
const RENT_BUDGETS: [string, string][] = [
  ["", "Any rent"], ["0-15000", "Under ₹15,000"], ["15000-30000", "₹15,000 to ₹30,000"], ["30000-", "Above ₹30,000"],
];
const TYPES: [string, string][] = [["", "Any type"], ["flat", "Flat"], ["house", "House"], ["villa", "Villa"], ["commercial", "Commercial"]];

export default function SearchBar({ initialTab = "buy" as Tab }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [locality, setLocality] = useState("");
  const [ptype, setPtype] = useState("");
  const [budget, setBudget] = useState("");

  const budgets = tab === "rent" ? RENT_BUDGETS : SALE_BUDGETS;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (locality) p.set("locality", locality);
    if (ptype && tab !== "plot") p.set("ptype", ptype);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min && min !== "0") p.set("min", min);
      if (max) p.set("max", max);
    }
    let base = "/properties/indore";
    if (tab === "auction") base = "/bank-auction-properties/indore";
    if (tab === "plot") base = "/properties/indore/plot";
    if (tab === "rent") p.set("type", "rent");
    const qs = p.toString();
    router.push(qs ? `${base}?${qs}` : base);
  }

  const field = "h-12 w-full rounded-xl border border-line bg-white px-3 text-[15px] text-ink focus:border-narmada-600";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-2 shadow-[0_20px_50px_-24px_rgba(11,42,38,0.35)]">
      <div role="tablist" aria-label="What are you looking for" className="flex gap-1 border-b border-line px-1 pb-2 pt-1">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id}
            onClick={() => { setTab(t.id); setBudget(""); }}
            className={`rounded-lg px-4 py-2 text-[15px] font-semibold transition-colors ${tab === t.id ? "bg-narmada-900 text-white" : "text-ink/70 hover:bg-narmada-50"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.15fr] xl:grid-cols-[1fr_1fr_1.15fr]">
        <label className="block">
          <span className="mb-1 block px-1 text-[13px] text-muted">Locality</span>
          <select className={field} value={locality} onChange={(e) => setLocality(e.target.value)}>
            <option value="">All of Indore</option>
            {LOCALITY_NAMES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block px-1 text-[13px] text-muted">Property type</span>
          <select className={`${field} disabled:bg-paper disabled:text-muted`} value={tab === "plot" ? "" : ptype} disabled={tab === "plot"} onChange={(e) => setPtype(e.target.value)}>
            {tab === "plot" ? <option value="">Plot</option> : TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block px-1 text-[13px] text-muted">{tab === "rent" ? "Monthly rent" : "Budget"}</span>
          <select className={field} value={budget} onChange={(e) => setBudget(e.target.value)}>
            {budgets.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-marigold-500 px-7 text-[16px] font-bold text-narmada-900 hover:bg-marigold-400 sm:col-span-2 lg:col-span-3">
          <Search /> Search
        </button>
      </div>
    </form>
  );
}
