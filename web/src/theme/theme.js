// theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#41B3A3", // Aqua Mint
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#D6F5EF", // Frost Grey Mint
    },
    accent: {
      main: "#FF8C42", // Warm pop contrast
    },
    background: {
      default: "#FFFFFF",
      paper: "#F7FBFA",
    },
    text: {
      primary: "#202020",
      secondary: "#4F4F4F",
    },
    error: {
      main: "#ff4444",
    },
    warning: {
      main: "#FF8C42",
    },
    action: {
      hover: "rgba(65, 179, 163, 0.08)",
      selected: "rgba(65, 179, 163, 0.12)",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          padding-top: 64px;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7AD7CC", // Softer aqua for dark mode
      contrastText: "#121414",
    },
    secondary: {
      main: "#276963", // Deep Mint Green Shade
    },
    accent: {
      main: "#FFB36D",
    },
    background: {
      default: "#121414",
      paper: "#1D2424",
    },
    text: {
      primary: "#ECECEC",
      secondary: "#A7A7A7",
    },
    error: {
      main: "#ff6b6b",
    },
    warning: {
      main: "#FFB36D",
    },
    action: {
      hover: "rgba(122, 215, 204, 0.08)",
      selected: "rgba(122, 215, 204, 0.15)",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: #121414;
          color: #ECECEC;
          min-height: 100vh;
          padding-top: 64px;
        }
        :root {
          color-scheme: dark;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1D2424",
        },
      },
    },
  },
});
