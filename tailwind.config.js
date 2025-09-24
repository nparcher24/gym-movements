/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["American Captain", "sans-serif"],
        subHeading: ["Kollektif", "sans-serif"],
        body: ["Montserrat", "sans-serif"],
        timer: ["Alarm Clock", "sans-serif"],
        chalk: ["DK Crayon Crumble"],
        chalkHeading: ["KG Second Chances Sketch"],
        chalkSubheading: ["DK Crayon Crumble"],
      },
      colors: {
        TARed: "#AB0000",
        TADarkRed: "#780000",
        TABlue: "#669BBC",
        TADarkBlue: "#304890",
      },
    },
  },
  plugins: [],
};
