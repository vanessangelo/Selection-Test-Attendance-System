/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      mont: ["Montserrat Alternates", "sans-serif"],
      open: ["Open Sans", "sans-serif"],
      rob: ["Roboto Condensed", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      darkpurple: "#322D42",
      purplee: "#402F5C",
      rosee: "#9F5264",
      magnolia: "#FAF3FB",
      blush: "#fff0f5",
      palepurple: "#FCE8FF",
      redd: "#C91A3D",
      bluee: "#1A3DC9",
      greenn: "#3DC91A",
    },
    fontSize: {
      xxs: "0.5rem",
      xs: "0.75rem",
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    letterSpacing: {
      tighter: "-0.1em",
      tight: "-0.05em",
      normal: "0",
      wide: "0.1em",
      wider: "0.2em",
      widest: "0.3em",
    },
  },
  plugins: [require("flowbite/plugin")],
};
