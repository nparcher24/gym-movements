module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        heading: ["American Captain", "sans-serif"],
        subHeading: ["Kollektif", "sans-serif"],
        body: ["Montserrat", "sans-serif"],
        timer: ["Alarm Clock", "sans-serif"],
      },
      colors: {
        TARed: "#AB0000",
        TADarkRed: "#780000",
        TABlue: "#669BBC",
        TADarkBlue: "#304890",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
