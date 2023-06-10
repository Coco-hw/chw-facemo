/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-50% *1.5))" },
        },
        slideRight: {
          "0%": { transform: "translateX(calc(-50%*1.5))" },
          "100%": { transform: "translateX(calc(0))" },
        },
        slideWrap: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        "slide-left": "slideLeft 10s linear infinite",
        "slide-right": "slideRight 10s linear infinite",
        "slide-wrap": "slideWrap 10s linear infinite",
      },
    },
  },
  plugins: [],
});
