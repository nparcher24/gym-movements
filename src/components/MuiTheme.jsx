// import { createMuiTheme } from "@mui/core";
import { createTheme } from "@mui/material/styles";

export const MuiTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#304890",
    },
    secondary: {
      main: "#ab0000",
    },
  },
  typography: {
    h1: {
      fontSize: "3.7rem",
      fontFamily: "Oswald",
      letterSpacing: "0.19em",
      fontWeight: 800,
    },
    h2: {
      fontFamily: "Oswald",
      fontSize: "3.1rem",
      fontWeight: 500,
      letterSpacing: "0.1em",
    },
    subtitle1: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h3: {
      fontFamily: "Oswald",
      letterSpacing: "0.11em",
    },
    h4: {
      fontFamily: "Oswald",
      letterSpacing: "0.1em",
    },
    h5: {
      fontFamily: "Oswald",
    },
    h6: {
      fontFamily: "Oswald",
      letterSpacing: "0.1em",
      fontSize: "1.9rem",
    },
    subtitle2: {
      fontFamily: "Montserrat",
    },
    body1: {
      fontFamily: "Montserrat",
    },
    body2: {
      fontFamily: "Montserrat",
    },
    overline: {
      fontFamily: "Montserrat",
    },
    caption: {
      fontFamily: "Montserrat",
    },
  },
  shape: {
    borderRadius: 12,
  },
  overrides: {
    MuiSwitch: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: 8,
      },
      switchBase: {
        padding: 1,
        "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + $track": {
            opacity: 1,
            border: "none",
          },
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 13,
        border: "1px solid #bdbdbd",
        backgroundColor: "#fafafa",
        opacity: 1,
        transition:
          "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
    },
  },
});
