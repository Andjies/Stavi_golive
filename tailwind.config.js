/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-fredoka)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        stavi: {
          cream: "#FDFBF7",
          paper: "#FFF9E6",
          ink: "#2B2D42",
          inkSoft: "#4A4E69",
          muted: "#8D99AE",
          terracotta: "#E07A5F",
          terracottaDeep: "#C8654A",
          sun: "#F2CC8F",
          sage: "#81B29A",
          night: "#3D405B",
          peach: "#F4A261",
        },
      },
      keyframes: {
        "float-soft": {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
        blob: {
          "0%,100%": { borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%" },
          "50%": { borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%" },
        },
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "float-soft": "float-soft 6s ease-in-out infinite",
        blob: "blob 12s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
