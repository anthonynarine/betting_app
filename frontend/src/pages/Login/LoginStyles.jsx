export const LoginStyles = (theme) => ({
  container: {
    backgroundColor: "#f5f5f5",
    height: "100vh",
    display: "flex",
    maxWidth: "60%",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 25,
    backgroundImage: "url(https://source.unsplash.com/random/?plants)",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  loginBox: {
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: 3,
    padding: theme.spacing(4),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    color: "#333",
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    color: '#0A0F11',
    fontWeight: 500,
    fontSize: 18,
  },
});

//   to acces in component needed
//   import { useTheme } from "@mui/material";
//   const theme = useTheme();
//   const classes = LoginStyles(theme);
// example sx={classes.mainBox}
