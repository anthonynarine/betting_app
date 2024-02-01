import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const createBettingAppTheme = (mode) => {
  let theme = createTheme({
    typography: {
      fontFamily: ["Roboto", "sans-serif", "Teko", "sans-serif"].join(","),
      body2: {
        fontWeight: 600,
        letterSpacing: "0.5px",
      },
    },
    primaryAppBar: {
      height: 100,
    },
    primaryDraw: {
      width: 250,
      closed: 100,
    },
    secondaryDraw: {
      width: 260,
    },
    palette: {
      mode,
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          color: "default",
          elevation: 0,
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            backgroundColor: "#f2f2f2",
            color: " #333", // text color
          }
        }
      },
      // MuiButton: {
      //   styleOverrides: {
      //     containedPrimary: {
      //       backgroundColor: mode === "dark" ? "#222" : undefined,
      //       "&:hover": {
      //         backgroundColor: mode === "dark" ? "#222" : undefined,
      //       },
      //     },
      //   },
      // },
      // MuiDivider: {
      //   styleOverrides: {
      //     root: {
      //       backgroundColor: "yellow",
      //     },
      //   },
      // },  
    }
  });

  theme = responsiveFontSizes(theme);

  return theme;
};



/*  

to use in a component:
import { useTheme } from "@mui/material/styles";

const theme = useTheme(); */


