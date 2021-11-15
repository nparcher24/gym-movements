module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
