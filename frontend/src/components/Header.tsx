import Link from "next/link";
import Logo from "./Logo";
import { Menu } from "./Icons";

const NAV = [
  { href: "/properties/indore", label: "Buy" },
  { href: "/properties/indore?type=rent", label: "Rent" },
  { href: "/properties/indore/plot", label: "Plots" },
  { href: "/bank-auction-properties/indore", label: "Bank auctions" },
  { href: "/#localities", label: "Localities" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-page items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href}
              className="rounded-lg px-3 py-2 text-[15px] font-medium text-ink/80 hover:bg-narmada-50 hover:text-narmada-900">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/post-property"
            className="hidden rounded-xl bg-marigold-500 px-4 py-2 text-[15px] font-semibold text-narmada-900 hover:bg-marigold-400 sm:inline-block">
            Post property, free
          </Link>
          <details className="relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-line" aria-label="Open menu">
              <Menu />
            </summary>
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-line bg-white p-2 shadow-xl">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} className="block rounded-lg px-3 py-2.5 text-[15px] font-medium hover:bg-narmada-50">
                  {n.label}
                </Link>
              ))}
              <Link href="/post-property" className="mt-1 block rounded-lg bg-marigold-500 px-3 py-2.5 text-center text-[15px] font-semibold text-narmada-900">
                Post property, free
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
