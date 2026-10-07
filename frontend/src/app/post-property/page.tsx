import type { Metadata } from "next";
import PostPropertyForm from "@/components/PostPropertyForm";

export const metadata: Metadata = { title: "Post your property in Indore, free", robots: { index: false } };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-[34px] font-bold leading-tight text-narmada-900">Post your property</h1>
      <p className="mt-2 max-w-xl text-muted">Tell us about your flat, house or plot in Indore. Listing is free, and a person on our team reviews it before it appears on the site.</p>
      <div className="mt-8"><PostPropertyForm /></div>
    </div>
  );
}
