import Link from "next/link";
import Logo from "./Logo";
import { LOCALITY_NAMES } from "@/lib/constants";
import { slugify } from "@/lib/format";

export default function Footer() {
  return (
    <footer className="mt-20 bg-narmada-900 text-narmada-100">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-narmada-200">
            Homes, plots and bank auction deals in Indore, with price checks and a verification checklist on every listing.
          </p>
          <p className="mt-4 font-display text-lg text-marigold-400" lang="hi">प्रॉपर्टी का सही मौका</p>
        </div>
        <FooterCol title="Property in Indore" links={LOCALITY_NAMES.slice(0, 6).map((l) => ({
          href: `/properties/indore/${slugify(l)}`, label: `Property in ${l}`,
        }))} />
        <FooterCol title="Browse" links={[
          { href: "/properties/indore/flat", label: "Flats for sale" },
          { href: "/properties/indore/house", label: "Houses for sale" },
          { href: "/properties/indore/plot", label: "Plots for sale" },
          { href: "/properties/indore?type=rent", label: "Rent in Indore" },
          { href: "/properties/indore?type=distressed", label: "Distressed deals" },
        ]} />
        <FooterCol title="Auctions and sellers" links={[
          { href: "/bank-auction-properties/indore", label: "Bank auction properties" },
          { href: "/post-property", label: "Post a property" },
        ]} />
      </div>
      <div className="border-t border-narmada-800">
        <p className="mx-auto max-w-page px-4 py-5 text-[13px] leading-relaxed text-narmada-300 sm:px-6">
          Listings shown in this build are sample data for design and development. Auction properties need independent
          checks of title, possession, dues, litigation and auction terms before any bid.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-[15px]">
        {links.map((l) => (
          <li key={l.href}><Link href={l.href} className="text-narmada-200 hover:text-white">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
