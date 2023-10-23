import React from "react";
import { Button, Box } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import { useAuthServices } from "../../../Auth/AuthServices";

export default function LoginLogoutButton() {
  // const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"));
  const { logout, isLoggedIn, setIsLoggedIn } = useAuthServices();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/");
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
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#00DE49",
              color: "#121214",
            },
          }}
          // endIcon={<ExitToAppIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "50px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#00DE49",
              color: "#121214",
            },
          }}
          // endIcon={<VpnKeyIcon />}
          onClick={handleLogin}
        >
          Login
        </Button>
      )}
    </Box>
  );
}
