"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const TILE_URL = process.env.NEXT_PUBLIC_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export default function MapView({ items, className = "", single = false }: { items: Property[]; className?: string; single?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false }).setView([22.7196, 75.8577], 12);
      L.tileLayer(TILE_URL, { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(map);
      const pts: [number, number][] = [];
      for (const p of items) {
        pts.push([p.lat, p.lng]);
        const icon = L.divIcon({
          className: "price-pin-wrap",
          html: single
            ? `<span class="price-pin price-pin-single"></span>`
            : `<span class="price-pin ${p.listing_type === "auction" ? "is-auction" : ""}">${esc(formatPrice(p.price, p.listing_type))}</span>`,
          iconSize: [0, 0],
        });
        const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
        if (!single) {
          m.bindPopup(`<a class="map-popup" href="/property/indore/${esc(p.slug)}"><strong>${esc(p.title)}</strong><br/>${esc(formatPrice(p.price, p.listing_type))} · ${esc(p.locality)}</a>`);
        }
      }
      if (single && pts.length) map.setView(pts[0], 15);
      else if (pts.length > 1) map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
      else if (pts.length === 1) map.setView(pts[0], 14);
    })();
    return () => { cancelled = true; map?.remove(); };
  }, [items, single]);

  return <div ref={ref} className={`z-0 w-full overflow-hidden rounded-2xl border border-line bg-narmada-50 ${className}`} role="region" aria-label="Map of properties" />;
}
