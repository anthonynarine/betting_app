import React from "react";
import { Button, Box } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import { useAuthServices } from "../../../Auth/AuthServices";

export default function LoginLogoutButton() {
  const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"));
  const { logout } = useAuthServices();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", height: 100 }}
    >
      {isLoggedIn ? (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "50px",
            "&:hover": {
              backgroundColor: "#737474",
              color: "#121214",
            },
          }}
          endIcon={<ExitToAppIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <Button
          variant="outlined"
          sx={{
            borderColor: "#000",
            color: "#000",
            borderRadius: "50px",
          }}
          endIcon={<VpnKeyIcon />}
          onClick={handleLogin}
        >
          Login
        </Button>
      )}
    </Box>
  );
}
