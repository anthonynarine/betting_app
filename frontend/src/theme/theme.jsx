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
      height: 65,
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
      primary: {
        light: '#909090', // A lighter shade of black for light contexts
        main: '#1B1B1B', // A medium dark shade that works well for various UI elements
        dark: '#0A0A0A', // Your preferred dark shade for primary elements
        contrastText: '#ffffff', // White text for the best contrast on primary elements
      },
      secondary: {
        light: '#FF5C8D', // A lighter, softer pink for secondary elements that need to stand out less
        main: '#D81B60', // Your chosen accent color, perfect for buttons, icons, etc.
        dark: '#A00037', // A darker shade of the accent color for hover states or active states
        contrastText: '#ffffff', // White text for optimal readability against the secondary color
      },
      background: {
        default: mode === 'light' ? '#f7f7f7' : '#EBF0F9', // Adjust the default background color based on theme mode
        paper: mode === 'light' ? '#ffffff' : '#424242', // Adjust the background color for paper elements based on theme mode
      },
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
            color: " #333",
          }
        }
      },
    }
  });

  theme = responsiveFontSizes(theme);

  return theme;
};

/*  

to use in a component:
import { useTheme } from "@mui/material/styles";

const theme = useTheme(); */


