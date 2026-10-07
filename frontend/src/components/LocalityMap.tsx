import type { Locality } from "@/lib/types";

// Rajwada, used as the orientation point.
const RAJWADA = { name: "Rajwada", lat: 22.7185, lng: 75.8556 };

function lerp(a: number, b: number, t: number) { return Math.round(a + (b - a) * t); }
function colorAt(t: number) {
  // light mint -> deep narmada
  const c1 = [185, 215, 208], c2 = [16, 63, 56];
  return `rgb(${lerp(c1[0], c2[0], t)}, ${lerp(c1[1], c2[1], t)}, ${lerp(c1[2], c2[2], t)})`;
}

/** Schematic map: localities placed by real coordinates, bubble size = listings, colour = average price per sq.ft. */
export default function LocalityMap({ localities }: { localities: Locality[] }) {
  const W = 560, H = 470, pad = 70;
  const pts = [...localities.map((l) => ({ lat: l.lat, lng: l.lng })), RAJWADA];
  const lats = pts.map((p) => p.lat), lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  // keep a roughly true aspect ratio (1 degree lng is ~0.92 of lat at this latitude)
  const spanX = (maxLng - minLng) * 0.92 || 1, spanY = maxLat - minLat || 1;
  const scale = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);
  const offX = (W - spanX * scale) / 2, offY = (H - spanY * scale) / 2;
  const px = (lng: number) => offX + (lng - minLng) * 0.92 * scale;
  const py = (lat: number) => H - (offY + (lat - minLat) * scale);

  const prices = localities.map((l) => l.avg_price_per_sqft || 0);
  const lo = Math.min(...prices), hi = Math.max(...prices);
  const maxCount = Math.max(...localities.map((l) => l.count), 1);

  // Nudge overlapping bubbles apart (keeping them near their true positions) so every label stays readable.
  const nodes = localities.map((l) => ({
    l, r: 20 + 16 * Math.sqrt(l.count / maxCount), x: px(l.lng), y: py(l.lat),
  }));
  for (let iter = 0; iter < 120; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const min = a.r + b.r + 34; // gap leaves room for the name label
        if (d < min) {
          const push = (min - d) / 2;
          dx /= d; dy /= d;
          a.x -= dx * push; a.y -= dy * push; b.x += dx * push; b.y += dy * push;
        }
      }
    }
    for (const n of nodes) {
      n.x = Math.min(W - Math.max(n.r + 8, 62), Math.max(Math.max(n.r + 8, 62), n.x));
      n.y = Math.min(H - n.r - 24, Math.max(n.r + 8, n.y));
    }
  }

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Indore localities by average price per square foot">
        <ellipse cx={W / 2} cy={H / 2 + 6} rx={W / 2 - 24} ry={H / 2 - 30} fill="none" stroke="#B9D7D0" strokeWidth="1.5" strokeDasharray="3 7" />
        <g>
          <circle cx={px(RAJWADA.lng)} cy={py(RAJWADA.lat)} r="4.5" fill="#F5A81C" />
          <circle cx={px(RAJWADA.lng)} cy={py(RAJWADA.lat)} r="10" fill="none" stroke="#F5A81C" strokeWidth="1.5" opacity="0.6" />
          <text x={px(RAJWADA.lng) - 14} y={py(RAJWADA.lat) + 4} textAnchor="end" fontSize="12" fill="#8F5A03" fontWeight="600" paintOrder="stroke" stroke="#F0F7F5" strokeWidth="3">Rajwada</text>
        </g>
        {nodes.map(({ l, r, x, y }, i) => {
          const t = hi === lo ? 0.5 : ((l.avg_price_per_sqft || 0) - lo) / (hi - lo);
          const dark = t > 0.45;
          const k = l.avg_price_per_sqft ? `${(l.avg_price_per_sqft / 1000).toFixed(1)}k` : "-";
          return (
            <a key={l.slug} href={`/properties/indore/${l.slug}`} className="locality-bubble" style={{ animationDelay: `${i * 70}ms` }}>
              <title>{`${l.name}: ${l.count} listings, average ₹${(l.avg_price_per_sqft || 0).toLocaleString("en-IN")} per sq.ft`}</title>
              <circle cx={x} cy={y} r={r} fill={colorAt(t)} stroke="#fff" strokeWidth="2.5" />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={dark ? "#fff" : "#0B2A26"} fontFamily="Bricolage Grotesque, Hind, sans-serif">{k}</text>
              <text x={x} y={y + r + 15} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#12201D" paintOrder="stroke" stroke="#fff" strokeWidth="3.5">{l.name}</text>
            </a>
          );
        })}
      </svg>
      <figcaption className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted">
        <span>Bubble size: number of listings</span>
        <span className="inline-flex items-center gap-2">
          Average price per sq.ft
          <span className="h-2.5 w-24 rounded-full" style={{ background: `linear-gradient(90deg, ${colorAt(0)}, ${colorAt(1)})` }} />
        </span>
        <span>Schematic, not to scale</span>
      </figcaption>
    </figure>
  );
}
