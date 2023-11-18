import React, { useEffect, useState } from "react";
import { Button, TextField, Container, Typography, Box, useTheme } from "@mui/material";
import { useAuthServices } from "../../context/Auth/AuthServices";
import { Link, useNavigate } from "react-router-dom";
// import { useLogin } from "../../context/login/LoginContext";
import { LoginStyles } from "./LoginStyles";
import { validatePasswordLogin, validateEmail } from "./validators/LoginValidators";
// import { useUserServices } from "../../context/user/UserServices";
import { useUserData } from "../../context/user/UserContext";

const LoginPage = () => {
  //  Handles for textfields/inputfields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handles username and password valitaion error
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const { obtainTokens, getUserIdFromToken, isLoggedIn, login, logout, } = useAuthServices();
  // const { fetchUserDetails, setUserDetails } = useUserServices();
  const { fetchUserData } = useUserData()
 
  const theme = useTheme();
  const classes = LoginStyles(theme);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const emailErrorMsg = validateEmail(email);
    const passwordErrorMsg = validatePasswordLogin(password);

    setEmailError(emailErrorMsg);
    setPasswordError(passwordErrorMsg);

    // If there's a validation error, we exit the function without proceeding
    if (emailErrorMsg || passwordErrorMsg) {
      return;
    }

    // Handle login logic here
    try {
      const tokens = await obtainTokens(email, password);

      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);
      localStorage.setItem("userId", getUserIdFromToken(tokens.access));

      login();
      // await fetchUserDetails();
      await fetchUserData()

      // console.log("Access Token being stored:", tokens.access);
      // console.log("Refresh Token being stored:", tokens.refresh);
      // console.log("getUserIdFromToken:", getUserIdFromToken(tokens.access));

      // navigate("/testlogin");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setApiError("Invalid email or password. Please try again");
      } else {
        setApiError("An unexpected error occured. Please try again later");
      }
      logout();
      console.error("Error retrieving token:", error);
    }
  };

  return (
    <Box sx={classes.root}>
      <Container component="main" maxWidth="xs" sx={classes.container}>
        <Box sx={classes.loginBox}>
          <Typography
            variant="h5"
            noWrap
            component="h1"
            sx={{ alignItems: "center", fontWeight: 500, pb: 2 }}
          >
            Sign in
          </Typography>
          {apiError && <Typography color="error">{apiError}</Typography>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="username"
              name="username"
              label="username"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="password"
              name="password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              sx={classes.button}
              disableElevation
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </Box>
          <Typography
            variant="subtitle2"
            noWrap
            component="h1"
            sx={{ alignItems: "center", fontWeight: 500, pb: 2 , pt:2}}
          ><Link to={"/signup"}>Dont have an account? Signup</Link>
            
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
