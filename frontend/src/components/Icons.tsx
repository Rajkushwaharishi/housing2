import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...p,
});

export const Check = (p: P) => <svg {...base(p)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const Pin = (p: P) => <svg {...base(p)}><path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>;
export const Chevron = (p: P) => <svg {...base(p)}><path d="M9 6l6 6-6 6" /></svg>;
export const Search = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>;
export const Phone = (p: P) => <svg {...base(p)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" /></svg>;
export const Bed = (p: P) => <svg {...base(p)}><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5" /><circle cx="7" cy="11" r="1.6" /></svg>;
export const Area = (p: P) => <svg {...base(p)}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
export const Compass = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></svg>;
export const Layers = (p: P) => <svg {...base(p)}><path d="M12 4l9 5-9 5-9-5 9-5z" /><path d="M3 14l9 5 9-5" /></svg>;
export const Shield = (p: P) => <svg {...base(p)}><path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>;
export const Gavel = (p: P) => <svg {...base(p)}><path d="M14 4l6 6M11 7l6 6M5 19l7-7M3 21h8M13.5 2.5l-4 4 7 7 4-4" /></svg>;
export const Tag = (p: P) => <svg {...base(p)}><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="8" cy="9" r="1.2" /></svg>;
export const Home = (p: P) => <svg {...base(p)}><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-6h4v6" /></svg>;
export const Building = (p: P) => <svg {...base(p)}><path d="M6 21V4h12v17M3 21h18M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" /></svg>;
export const Plot = (p: P) => <svg {...base(p)}><path d="M4 8l8-4 8 4v9l-8 4-8-4z" /><path d="M4 8l8 4 8-4M12 12v9" /></svg>;
export const Key = (p: P) => <svg {...base(p)}><circle cx="8" cy="14" r="4" /><path d="M11 11l8-8M16 6l3 3M14 8l2 2" /></svg>;
export const Map = (p: P) => <svg {...base(p)}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg>;
export const List = (p: P) => <svg {...base(p)}><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>;
export const Filter = (p: P) => <svg {...base(p)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>;
export const Menu = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const Whatsapp = (p: P) => <svg {...base(p)}><path d="M4 20l1.3-4.2A8 8 0 1112 20a8 8 0 01-3.8-1L4 20z" /><path d="M9 9c0 3 3 6 6 6l1.2-1.4-2-1-1 .7c-1-.4-1.8-1.2-2.2-2.2l.7-1-1-2L9 9z" /></svg>;
