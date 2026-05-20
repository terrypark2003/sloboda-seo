import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f7fb",
          100: "#e3edf6",
          200: "#c5d9ea",
          300: "#9bbcd9",
          400: "#6997c1",
          500: "#477aa8",
          600: "#36608a",
          700: "#2e5071",
          800: "#28435e",
          900: "#243a51",
          950: "#172534",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "맑은 고딕",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
