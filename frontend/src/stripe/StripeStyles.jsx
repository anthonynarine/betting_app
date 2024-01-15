// StripeStyles.js
export const StripeStyles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw', // Full width of the viewport
    paddingTop: "20vh",
    // backgroundColor: "#121212", // Dark background
  },
  container: {
    backgroundColor: "#1E1E1E",
    border: "1px solid #333",
    borderRadius: "10px", // Rounded corners for container
    padding: theme.spacing(2), // Consistent spacing
    color: "#FFF" // White text color
  },
  box1: {
    border: "1px solid #333",
    borderRadius: "5px",
    padding: "1rem",
    paddingBottom: "2rem",
    marginTop: "1rem",
    backgroundColor: "#242424", // Slightly lighter than container for contrast
  },
  card_element_box: {
    border: "1px solid #333",
    padding: "1rem",
    borderRadius: "4px",
    marginTop: "1rem", 
    marginBottom: "1rem", 
    backgroundColor: "#242424", // Same as box1
  },
  textField: {
    '& label.Mui-focused': {
      color: '#90caf9', // Light blue focus color
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#90caf9', // Light blue underline
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#333', // Dark border
      },
      '&:hover fieldset': {
        borderColor: '#FFF', // White border on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#90caf9', // Light blue border on focus
      },
    },
    '& .MuiInputBase-input': {
      color: '#FFF', // White text
    }
  },
  button: {
    backgroundColor: "#2979ff", // Bright blue button
    '&:hover': {
      backgroundColor: "#5393ff", // Lighter blue on hover
    },
    color: '#FFF', // White text on button
  }
});
