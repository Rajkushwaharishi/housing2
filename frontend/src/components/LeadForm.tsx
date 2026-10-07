"use client";
import { useState } from "react";
import { PUBLIC_API, WHATSAPP } from "@/lib/constants";
import { Phone, Whatsapp } from "./Icons";

export default function LeadForm({ slug, title, kind = "buyer", cta = "Get phone number" }: {
  slug: string; title: string; kind?: "buyer" | "assistance"; cta?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending"); setError("");
    try {
      const res = await fetch(`${PUBLIC_API}/api/leads`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: f.get("name"), phone: f.get("phone"), message: f.get("message") || null, property_slug: slug, kind }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        const detail = j?.detail;
        throw new Error(Array.isArray(detail) ? (detail[0]?.msg || "Check your details").replace("Value error, ", "") : detail || "Something went wrong");
      }
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl bg-narmada-50 p-4 text-[15px] text-narmada-900" role="status">
        <p className="font-semibold">Request sent</p>
        <p className="mt-1 text-muted">We will call you on the number you entered to share the next steps.</p>
      </div>
    );
  }

  const input = "h-11 w-full rounded-lg border border-line bg-white px-3 text-[15px] focus:border-narmada-600";
  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <label className="block"><span className="mb-1 block text-[13px] text-muted">Your name</span>
        <input name="name" required minLength={2} autoComplete="name" className={input} /></label>
      <label className="block"><span className="mb-1 block text-[13px] text-muted">Mobile number</span>
        <input name="phone" required inputMode="numeric" autoComplete="tel-national" placeholder="10-digit number" className={input} /></label>
      {kind === "assistance" && (
        <label className="block"><span className="mb-1 block text-[13px] text-muted">What do you need help with? (optional)</span>
          <input name="message" className={input} placeholder="Title check, bidding steps, site visit" /></label>
      )}
      {error && <p className="text-[14px] font-medium text-brick-600" role="alert">{error}</p>}
      <button disabled={state === "sending"} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-narmada-900 text-[15px] font-semibold text-white hover:bg-narmada-800 disabled:opacity-60">
        <Phone width={17} height={17} /> {state === "sending" ? "Sending" : cta}
      </button>
      {WHATSAPP && (
        <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I am interested in: ${title}`)}`} target="_blank" rel="noopener"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line text-[15px] font-semibold text-narmada-900 hover:bg-narmada-50">
          <Whatsapp width={17} height={17} /> Chat on WhatsApp
        </a>
      )}
    </form>
  );
}
