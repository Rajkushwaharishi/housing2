import Link from "next/link";

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="8" fill="#0B2A26" />
      <path d="M6 15L14 8l8 7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="19" r="2.8" fill="#F5A81C" />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="ZameenMauka home">
      <LogoMark />
      <span className={`font-display text-[22px] font-bold tracking-tight ${light ? "text-white" : "text-narmada-900"}`}>
        ZameenMauka
      </span>
    </Link>
  );
}
