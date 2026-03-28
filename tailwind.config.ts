import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F7F4",
        "canvas-dark": "#EFEDE8",
        ink: {
          DEFAULT: "#1C1917",
          secondary: "#57534E",
          muted: "#A8A29E",
        },
        border: "#E7E5E4",
        accent: {
          DEFAULT: "#2E5FA3",
          light: "#EEF3FB",
        },
        left: {
          DEFAULT: "#1E40AF",
          light: "#EFF6FF",
          mid: "#3B82F6",
        },
        right: {
          DEFAULT: "#9F1239",
          light: "#FFF1F2",
          mid: "#F43F5E",
        },
        center: {
          DEFAULT: "#57534E",
          light: "#F5F5F4",
        },
        sensation: {
          low: "#15803D",
          "low-bg": "#F0FDF4",
          mid: "#B45309",
          "mid-bg": "#FFFBEB",
          high: "#B91C1C",
          "high-bg": "#FEF2F2",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1C1917",
            maxWidth: "none",
            "h1,h2,h3": { fontFamily: "var(--font-lora), Georgia, serif" },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
