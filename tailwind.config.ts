import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: "#0a0e27",
          abyss: "#050505", // The dark background
        },
        crimson: {
          DEFAULT: "#dc2626", // Base Red
          glow: "#ef4444",    // Bright Red
          dark: "#7f1d1d",    // Deep Red
        },
        metal: {
          light: "#9ca3af",   // Chrome/Silver
          DEFAULT: "#374151", // Gunmetal
          dark: "#111827",    // Dark Steel
        }
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      boxShadow: {
        'metal': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'crimson-hit': '0 0 20px rgba(220, 38, 38, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;