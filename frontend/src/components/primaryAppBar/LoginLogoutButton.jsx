import React from "react";
import { Button, Box } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import { useAuthServices } from "../../context/Auth/AuthServices";
import { useUserServices } from "../../context/user/UserContext";
import AccountMenuBtn from "./AccountMenuBtn";

export default function LoginLogoutButton() {
  // const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"));
  const { isLoggedIn } = useAuthServices();
  const { userData } = useUserServices();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", height: 100 }}
    >
      {isLoggedIn ? (
        <AccountMenuBtn key={userData.id} />
      ) : (
        <>
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
            onClick={handleLogin}
          >
            Login
          </Button>
        </>
      )}
    </Box>
  );
}
