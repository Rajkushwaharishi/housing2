"use client";
import dynamic from "next/dynamic";

// Leaflet touches `window`, so it only loads in the browser and only when a map is shown.
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-full min-h-[300px] w-full animate-pulse rounded-2xl bg-narmada-50" />,
});
export default MapView;
