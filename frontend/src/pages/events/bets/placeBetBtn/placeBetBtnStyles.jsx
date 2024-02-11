

export const PlaceBetBtnStyles = (theme) => ({
  bettingClosed: {
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    color: "white",
    borderRadius: "15px",
    fontWeight: "500",
    padding: "3px 12px",
    fontSize: "0.875rem",
    textTransform: "none",
    "&.Mui-disabled": {
      color: "red",
      borderColor: "#000",
    },
  },
  placeBet: {
    borderColor: "#ffffff",
    backgroundColor:"#ffffff",
    color: "#000",
    borderRadius: "15px",
    fontWeight: "500",
    padding: "3px 12px",
    fontSize: "0.875rem",
    textTransform: "none",
    "&:hover": {
      borderColor: "#ffffff",
      backgroundColor: "#ffffff",
      color: "black",
    },
  },
  tooltipConfig: {
    PaperProps: {
      style: {
        backgroundColor: "#ffffff",
        color: "#000",
        fontSize: "0.75rem",
        borderRadius: "4px",
      },
    },
    PopperProps: {
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 4], // Adjust this value to control the tooltip's offset
          },
        },
      ],
    },
  },
});


//   to acces in component needed
//   import { useTheme } from "@mui/material";
//   const theme = useTheme();
//   const classes = PlaceBetBtnStyles(theme);
// example sx={classes.mainBox}
