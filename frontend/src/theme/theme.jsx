import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const createBettingAppTheme = (mode) => {
  let theme = createTheme({
    typography: {
      fontFamily: ["Roboto", "sans-serif","Teko", "sans-serif",].join(","),
      body2: {
        fontWeight: 600,
        letterSpacing: "0.5px",
      },
    },
    primaryAppBar: {
      height: 150,
    },
    primaryDraw: {
      width: 250,
      closed: 100,
    },
    // LIGHT AND DARK MODE
    palette: {
      mode, // Set the mode based on the argument passed (e.g., "light" or "dark")
    },
    // overrides MUI theme
    components: {
      MuiAppBar: {
        defaultProps: {
          color: "default",
          elevation: 0,
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            backgroundColor: mode === "dark" ? "#3A851B" : undefined, // Use default for light mode
            "&:hover": {
              backgroundColor: mode === "dark" ? "#222" : undefined, // Use default for light mode
            },
          },
        },
      },
    },
    //DIVIDER COLOR
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "yellow",
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);

  return theme;
};

/*  

to use in a component:
import { useTheme } from "@mui/material/styles";

const theme = useTheme();

*/
