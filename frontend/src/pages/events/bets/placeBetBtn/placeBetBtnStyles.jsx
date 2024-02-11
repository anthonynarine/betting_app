export const PlaceBetBtnStyles = (theme) => ({
  bettingClosed: {
    borderColor: "#EBF0F9",
    backgroundColor: "#EBF0F9",
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
    borderColor: "#EBF0F9",
    backgroundColor:"#EBF0F9",
    color: "#000",
    borderRadius: "15px",
    fontWeight: "500",
    padding: "3px 12px",
    fontSize: "0.875rem",
    textTransform: "none",
    "&:hover": {
      borderColor: "#EBF0F9",
      backgroundColor: "#EBF0F9",
      color: "black",
    },
  },
  tooltipConfig: {
    PaperProps: {
      style: {
        backgroundColor: "#EBF0F9",
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
