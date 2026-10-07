import type { PropertyType } from "@/lib/types";

/**
 * Stand-in artwork until real photos are uploaded. Deterministic per listing id,
 * drawn as SVG so cards stay light and never show a broken image.
 */
const PALETTES = [
  { sky: ["#CDE6E0", "#F1F8F5"], wall: "#F3EBDD", wall2: "#E3D5BC", roof: "#8C4A3A", glass: "#7FB1B0", ground: "#BFD8B4" },
  { sky: ["#FBE3B0", "#FFF6E2"], wall: "#EEF2F0", wall2: "#D3DDD9", roof: "#35544E", glass: "#6C9FB8", ground: "#C8D9A6" },
  { sky: ["#C8DCEB", "#EEF5FA"], wall: "#F6F0E6", wall2: "#E2D3C0", roof: "#6B5B4B", glass: "#86AEC4", ground: "#B7D2B0" },
  { sky: ["#D9E9D2", "#F6FAF1"], wall: "#F1E4D0", wall2: "#DCC7A7", roof: "#A4553F", glass: "#7DB0A8", ground: "#B5D1A3" },
  { sky: ["#F5D9C9", "#FFF3EA"], wall: "#EFF3F2", wall2: "#CFDAD6", roof: "#2F4D47", glass: "#8FB5C2", ground: "#C2D6A8" },
];

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

export default function PropertyArt({ id, type, className = "" }: { id: number; type: PropertyType; className?: string }) {
  const pal = PALETTES[id % PALETTES.length];
  const r = rng(id + 3);
  const gid = `sky-${id}`;
  const horizon = 232;

  const windows = (x: number, y: number, cols: number, rows: number, w: number, h: number, gx: number, gy: number) => {
    const out = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++)
        out.push(<rect key={`${x}-${y}-${i}-${j}`} x={x + i * (w + gx)} y={y + j * (h + gy)} width={w} height={h} rx="1.5"
          fill={pal.glass} opacity={r() > 0.8 ? 0.45 : 0.95} />);
    return out;
  };

  let body: JSX.Element;
  if (type === "flat") {
    const floors = 7 + Math.floor(r() * 4);
    const h = floors * 17;
    body = (
      <>
        <rect x="52" y={horizon - 120} width="62" height="120" fill={pal.wall2} />
        <rect x="292" y={horizon - 96} width="58" height="96" fill={pal.wall2} />
        <rect x="132" y={horizon - h} width="136" height={h} fill={pal.wall} />
        <rect x="132" y={horizon - h} width="136" height="8" fill={pal.roof} />
        {windows(144, horizon - h + 20, 4, floors - 1, 18, 9, 8, 8)}
        <rect x="186" y={horizon - 22} width="28" height="22" fill={pal.roof} />
      </>
    );
  } else if (type === "house" || type === "villa") {
    const wide = type === "villa";
    const x0 = wide ? 92 : 112, w = wide ? 216 : 176;
    body = (
      <>
        <rect x={x0} y={horizon - 78} width={w} height="78" fill={pal.wall} />
        <polygon points={`${x0 - 12},${horizon - 78} ${x0 + w / 2},${horizon - 134} ${x0 + w + 12},${horizon - 78}`} fill={pal.roof} />
        <rect x={x0 + w / 2 - 14} y={horizon - 44} width="28" height="44" rx="2" fill={pal.roof} />
        <rect x={x0 + 18} y={horizon - 62} width="34" height="26" rx="2" fill={pal.glass} />
        <rect x={x0 + w - 52} y={horizon - 62} width="34" height="26" rx="2" fill={pal.glass} />
        {wide && <rect x={x0 + w - 6} y={horizon - 50} width="38" height="50" fill={pal.wall2} />}
        <rect x={x0 - 24} y={horizon - 8} width={w + 48} height="8" fill={pal.wall2} />
      </>
    );
  } else if (type === "plot") {
    const posts = [];
    for (let i = 0; i < 9; i++) posts.push(<rect key={i} x={46 + i * 38} y={horizon - 26} width="5" height="26" fill={pal.roof} opacity="0.75" />);
    body = (
      <>
        <rect x="40" y={horizon - 18} width="320" height="3" fill={pal.roof} opacity="0.55" />
        <rect x="40" y={horizon - 8} width="320" height="3" fill={pal.roof} opacity="0.55" />
        {posts}
        <rect x="186" y={horizon - 78} width="4" height="52" fill={pal.roof} />
        <rect x="152" y={horizon - 96} width="72" height="34" rx="4" fill="#fff" stroke={pal.roof} strokeWidth="2" />
        <rect x="162" y={horizon - 86} width="52" height="5" rx="2" fill={pal.roof} />
        <rect x="162" y={horizon - 76} width="34" height="5" rx="2" fill={pal.glass} />
      </>
    );
  } else {
    body = (
      <>
        <rect x="70" y={horizon - 92} width="260" height="92" fill={pal.wall} />
        <rect x="70" y={horizon - 92} width="260" height="14" fill={pal.roof} />
        <rect x="86" y={horizon - 70} width="228" height="48" fill={pal.glass} opacity="0.9" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={118 + i * 38} y={horizon - 70} width="2.5" height="48" fill={pal.wall} />)}
        <rect x="176" y={horizon - 22} width="48" height="22" fill={pal.roof} />
      </>
    );
  }

  const trees = [58, 346, 28].map((x, i) => (
    <g key={i} opacity={type === "plot" && i === 0 ? 0 : 1}>
      <rect x={x - 2} y={horizon - 20} width="4" height="22" fill={pal.roof} opacity="0.7" />
      <circle cx={x} cy={horizon - 28} r={14 - i * 2} fill="#6FA37B" opacity="0.85" />
    </g>
  ));

  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} role="img"
      aria-label={`Illustration of a ${type}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.sky[0]} />
          <stop offset="1" stopColor={pal.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gid})`} />
      <circle cx={70 + r() * 260} cy={50 + r() * 20} r="20" fill="#fff" opacity="0.55" />
      <rect y={horizon} width="400" height="68" fill={pal.ground} />
      <rect y={horizon + 34} width="400" height="34" fill="#fff" opacity="0.18" />
      {body}
      {type !== "plot" && trees}
    </svg>
  );
}
