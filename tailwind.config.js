/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FAF7F2",
          dark: "#F3EDE3",
        },
        champagne: {
          DEFAULT: "#C9A876",
          light: "#DCC6A0",
          dark: "#B08F5E",
        },
        beige: {
          DEFAULT: "#E8DDD0",
          dark: "#DCCDBB",
        },
        charcoal: {
          DEFAULT: "#2B2724",
          light: "#3D3833",
          muted: "#6B6259",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.15em",
      },
      boxShadow: {
        luxury: "0 20px 60px -15px rgba(43, 39, 36, 0.15)",
        gold: "0 10px 40px -10px rgba(201, 168, 118, 0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
