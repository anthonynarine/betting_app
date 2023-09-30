import { createTheme, responsiveFontSizes } from "@mui/material";

export const createMuiTheme = (mode) => {
  let theme = createTheme({
    typography: {
      fontFamily: ['Teko', "sans-serif", 'Roboto', "sans-serif"].join(","),
      body2: {
        fontWeight: 600,
        letterSpacing: "0.5px",
      },
    },
    primaryAppBar: {
      height: 150,
    },
    primaryDraw: {
      width: 240,
      closed: 70,
    },
    palette: {
      mode,
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
            backgroundColor: "#C3CFE1", // Ice gray color
            '&:hover': {
              backgroundColor: "#3A851B", // Darker gray for hover state
            },
          },
        },
      },
// overides MUI textfield box border color placeholder label color
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E0E0', // change border color on hover
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E0E0E0', // change border color when focused
            },
          },
        },
      },
// overides MUI textfield onhover 
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '&:hover': {
              color: '#B0B0B0', // Change to your desired hover color
            },
            '&.Mui-focused': {
              color: 'black', // Change to your desired focus color
            },
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);

  return theme;
};
