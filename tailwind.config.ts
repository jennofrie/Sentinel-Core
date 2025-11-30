import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rajdhani", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        "cyber-amber": "#FFBF00",
        "signal-red": "#FF0033",
        "safe-cyan": "#00F0FF",
      },
    },
  },
  plugins: [],
};
export default config;

