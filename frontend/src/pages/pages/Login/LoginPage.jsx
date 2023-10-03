import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, useTheme } from "@mui/material";
import { useAuthServices } from "../../../Auth/AuthServices";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../components/Context/LoginContext";
import { LoginStyles } from "./LoginStyles";
import { validatePasswordLogin, validateUsername } from "./validators/LoginValidators";

// import { validatePasswordLogin, validateUsername } 

const LoginPage = () => {
  //  Handles for textfields/inputfields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Handles username and password valitaion error
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const { obtainTokens, getUserIdFromToken, getUserDetials } = useAuthServices();
  const { isLoggedIn, login, logout } = useLogin();

  const theme = useTheme();
  const classes = LoginStyles(theme);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const usernameErrorMsg = validateUsername(username);
    const passwordErrorMsg = validatePasswordLogin(password);

    setUsernameError(usernameErrorMsg);
    setPasswordError(passwordErrorMsg);

    // If there's a validation error, we exit the function without proceeding
    if (usernameErrorMsg || passwordErrorMsg) {
      return;
    }

    // Handle login logic here
    try {
      const tokens = await obtainTokens(username, password);

      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);
      localStorage.setItem("userId", getUserIdFromToken(tokens.access));

      login();
      console.log("YOU LOGGED IN", isLoggedIn);

      await getUserDetials();

      console.log("Access Token being stored:", tokens.access);
      console.log("Refresh Token being stored:", tokens.refresh);
      console.log("getUserIdFromToken:", getUserIdFromToken(tokens.access));

      // navigate("/testlogin");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setApiError("Invalid username or password. Please try again");
      } else {
        setApiError("An unexpected error occured. Please try again later");
      }
      logout();
      console.error("Error retrieving token:", error);
    }
  };

  return (
    <Box sx={{ ...LoginStyles.body }}>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!usernameError}
              helperText={usernameError}
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
            {username && password ? (
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
            ) : null}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
