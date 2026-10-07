"use client";
import { useState } from "react";
import { FACINGS, LOCALITY_NAMES, PUBLIC_API } from "@/lib/constants";
import { Check } from "./Icons";

const inputCls = "h-11 w-full rounded-lg border border-line bg-white px-3 text-[15px] focus:border-narmada-600";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[14px] font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[13px] text-muted">{hint}</span>}
    </label>
  );
}

export default function PostPropertyForm() {
  const [ptype, setPtype] = useState("flat");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const hasRooms = ["flat", "house", "villa"].includes(ptype);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const num = (k: string) => (f.get(k) ? Number(f.get(k)) : null);
    setState("sending"); setError("");
    try {
      const res = await fetch(`${PUBLIC_API}/api/properties`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_type: f.get("listing_type"), property_type: ptype, locality: f.get("locality"),
          address: f.get("address") || null, price: num("price"), area_sqft: num("area_sqft"),
          bedrooms: hasRooms ? num("bedrooms") : null, bathrooms: hasRooms ? num("bathrooms") : null,
          facing: f.get("facing") || null, description: f.get("description") || "",
          posted_by: f.get("posted_by"), contact_name: f.get("contact_name"), contact_phone: f.get("contact_phone"),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        const d = j?.detail;
        throw new Error(Array.isArray(d) ? `${d[0]?.loc?.slice(-1)[0] ?? "Field"}: ${(d[0]?.msg || "invalid").replace("Value error, ", "")}` : d || "Something went wrong");
      }
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center" role="status">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-narmada-100 text-narmada-700"><Check width={24} height={24} /></span>
        <h2 className="mt-4 font-display text-2xl font-bold text-narmada-900">Property submitted</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">Our team reviews every listing before it goes live. We will call the number you gave if we need more details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-xl font-bold text-narmada-900">About the property</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="I want to">
            <select name="listing_type" className={inputCls}><option value="resale">Sell</option><option value="rent">Rent out</option></select>
          </Field>
          <Field label="Property type">
            <select className={inputCls} value={ptype} onChange={(e) => setPtype(e.target.value)}>
              <option value="flat">Flat</option><option value="house">Independent house</option><option value="villa">Villa</option>
              <option value="plot">Plot</option><option value="commercial">Commercial</option>
            </select>
          </Field>
          <Field label="Locality">
            <select name="locality" required className={inputCls} defaultValue="">
              <option value="" disabled>Choose a locality</option>
              {LOCALITY_NAMES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Society, street or landmark" hint="Optional. Shown only as the area, not the exact door number.">
            <input name="address" className={inputCls} />
          </Field>
          {hasRooms && (
            <>
              <Field label="Bedrooms"><input name="bedrooms" type="number" min={0} max={10} required className={inputCls} /></Field>
              <Field label="Bathrooms"><input name="bathrooms" type="number" min={0} max={10} className={inputCls} /></Field>
            </>
          )}
          <Field label="Area (sq.ft)"><input name="area_sqft" type="number" min={1} required className={inputCls} /></Field>
          <Field label="Price in rupees" hint="Total price for sale, or monthly rent.">
            <input name="price" type="number" min={1} required className={inputCls} />
          </Field>
          <Field label="Facing">
            <select name="facing" className={inputCls} defaultValue=""><option value="">Not sure</option>{FACINGS.map((f) => <option key={f}>{f}</option>)}</select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description" hint="Floor, parking, nearby schools or markets, and why you are selling.">
            <textarea name="description" rows={4} maxLength={2000} className="w-full rounded-lg border border-line bg-white p-3 text-[15px] focus:border-narmada-600" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-xl font-bold text-narmada-900">Your contact details</h2>
        <p className="mt-1 text-[14px] text-muted">Buyers see your number only after they send an enquiry.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Field label="Your name"><input name="contact_name" required minLength={2} autoComplete="name" className={inputCls} /></Field>
          <Field label="Mobile number"><input name="contact_phone" required inputMode="numeric" autoComplete="tel-national" className={inputCls} /></Field>
          <Field label="You are a">
            <select name="posted_by" className={inputCls}><option value="owner">Owner</option><option value="broker">Broker</option><option value="builder">Builder</option></select>
          </Field>
        </div>
      </section>

      {error && <p className="rounded-lg bg-brick-50 p-3 text-[14px] font-medium text-brick-700" role="alert">{error}</p>}
      <button disabled={state === "sending"} className="h-12 rounded-xl bg-marigold-500 px-8 text-[16px] font-bold text-narmada-900 hover:bg-marigold-400 disabled:opacity-60">
        {state === "sending" ? "Submitting" : "Submit for review"}
      </button>
    </form>
  );
}
