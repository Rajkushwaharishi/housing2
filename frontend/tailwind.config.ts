import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        narmada: {
          50: "#F0F7F5", 100: "#DCEBE7", 200: "#B9D7D0", 300: "#8BBDB2",
          600: "#1F6B5E", 700: "#17594F", 800: "#103F38", 900: "#0B2A26",
        },
        marigold: {
          100: "#FDF0D2", 300: "#F9CB6B", 400: "#F8BC48", 500: "#F5A81C", 600: "#D98C06", 700: "#8F5A03",
        },
        brick: { 50: "#FDF1EF", 100: "#FBE0DB", 600: "#B8392B", 700: "#942D22" },
        paper: "#F5F7F6",
        line: "#DFE5E2",
        ink: "#12201D",
        muted: "#566763",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "Hind", "system-ui", "sans-serif"],
        sans: ["Hind", "system-ui", "sans-serif"],
      },
      maxWidth: { page: "80rem" },
    },
  },
  plugins: [],
};
export default config;
