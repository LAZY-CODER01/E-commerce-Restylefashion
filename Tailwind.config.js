/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          pink: "#F7246E",
          "pink-hover": "#F8085A",
          purple: "#913CF0",
          dark: "#2F2F2F",
          light: "#FAFAFA",
          accent1: "#F73425",
          accent2: "#F75925"
        },
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        "pink-md":  "0 4px 14px rgba(247,36,110,0.35)",
        "pink-lg":  "0 6px 20px rgba(247,36,110,0.45)",
        drawer:     "8px 0 40px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};