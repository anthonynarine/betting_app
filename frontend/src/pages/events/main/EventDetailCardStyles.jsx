// usage
//   const theme = useTheme();
//   const classes = EventDetailCardStyles(theme);
//   sx={classes.Card}

export const EventDetailCardStyles = (theme) => ({
  card: {
    width: { xs: 400, sm: 400, md: 400, lg: 500 }, // Specify fixed widths for different breakpoints
    minHeight: 400, // Minimum height for the card
    maxHeight: "auto", // Adjust maxHeight or set it to 'auto'
    overflow: "auto",
    borderRadius: "20px",
    borderColor: "#000",
    background: "#fff",
    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.5)",
    "& img": {
      width: "100%", // Image takes full width of the card
      height: "300px", // Fixed height for the image
      objectFit: "cover",
    },
  },
  cardContentBox: {
    margin: 2,
    backgroundColor: "white",
    display: "flex", // Enables flexbox
    flexDirection: "column", // Stacks children vertically
    justifyContent: "center", // Centers content vertically in the box
    alignItems: "center", // Centers content horizontally in the box
  },
});
