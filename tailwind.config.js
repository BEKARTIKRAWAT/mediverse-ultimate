/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: { "xs": "475px", "2xl": "1536px" },
      container: { center: true, padding: { DEFAULT: "1rem", sm: "2rem", lg: "4rem" } },
      animation: { "fade-in": "fadeIn 0.5s ease-out" },
      keyframes: { fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } } }
    }
  },
  plugins: []
};
