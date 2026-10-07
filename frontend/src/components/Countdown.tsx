"use client";
import { useEffect, useState } from "react";

export default function Countdown({ iso }: { iso: string }) {
  const [text, setText] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const ms = new Date(iso).getTime() - Date.now();
      if (ms <= 0) return setText("Auction time has passed");
      const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4);
      setText(d > 0 ? `${d}d ${h}h left` : `${h}h ${m}m left`);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [iso]);
  return <span suppressHydrationWarning>{text}</span>;
}
