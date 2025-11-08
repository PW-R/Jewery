// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        italiana: ["Italiana", "serif"],
        inria: ['"Inria Serif"', "serif"],
        sans: ['"Inria Serif"', "serif"],
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease forwards",
        "slide-out": "slide-out 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};
