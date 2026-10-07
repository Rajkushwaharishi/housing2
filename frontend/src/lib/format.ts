const trim = (v: number) => v.toFixed(2).replace(/\.?0+$/, "");

export function formatPrice(n: number, listing?: string): string {
  if (listing === "rent") return `₹${n.toLocaleString("en-IN")}/mo`;
  if (n >= 1e7) return `₹${trim(n / 1e7)} Cr`;
  if (n >= 1e5) return `₹${trim(n / 1e5)} Lakh`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export const formatArea = (n: number) => `${n.toLocaleString("en-IN")} sq.ft`;

export function formatDate(iso: string, withTime = false): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Asia/Kolkata",
  });
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function ordinal(n: number): string {
  if (n === 0) return "Ground";
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}
