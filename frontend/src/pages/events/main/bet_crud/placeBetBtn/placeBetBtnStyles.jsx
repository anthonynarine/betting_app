export const PlaceBetBtnStyles = (theme) => ({
  bettingClosed: {
    borderColor: "#000",
    backgroundColor: "#000",
    color: "white",
    borderRadius: "15px",
    fontWeight: "500",
    // textShadow: "1px 1px 2px #aaa",
    padding: "3px 12px", // Smaller padding
    fontSize: "0.875rem", // Smaller font size
    textTransform: "none",
    "&.Mui-disabled": {
      color: "red", // Override for disabled state
      borderColor: "#000",
    },
  },
  placeBet: {
    borderColor: "#000",
    backgroundColor: "#000",
    color: "#00DE49",
    borderRadius: "15px",
    fontWeight: "500",
    // textShadow: "1px 1px 2px #aaa",
    padding: "3px 12px", // Smaller padding
    fontSize: "0.875rem", // Smaller font size
    textTransform: "none",
    "&:hover": {
      borderColor: "#00DE49",
      backgroundColor: "#00DE49",
      color: "black",
    },
  },
});

//   to acces in component needed
//   import { useTheme } from "@mui/material";
//   const theme = useTheme();
//   const classes = PlaceBetBtnStyles(theme);
// example sx={classes.mainBox}
