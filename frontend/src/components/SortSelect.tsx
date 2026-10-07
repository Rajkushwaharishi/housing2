"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SortSelect({ basePath, current, options }: {
  basePath: string; current: Record<string, string | undefined>; options: [string, string][];
}) {
  const router = useRouter();
  const [, start] = useTransition();
  return (
    <label className="inline-flex items-center gap-2 text-[14px] text-muted">
      Sort by
      <select className="h-10 rounded-lg border border-line bg-white px-2.5 text-[14px] text-ink focus:border-narmada-600"
        value={current.sort || options[0][0]}
        onChange={(e) => {
          const p = new URLSearchParams();
          for (const [k, v] of Object.entries({ ...current, sort: e.target.value, page: undefined })) if (v) p.set(k, v);
          start(() => router.push(`${basePath}?${p.toString()}`));
        }}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
