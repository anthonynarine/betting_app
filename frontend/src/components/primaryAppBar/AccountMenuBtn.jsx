import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuthServices } from "../../context/Auth/AuthServices";
import { useNavigate } from "react-router-dom";
import { useUserServices } from "../../context/user/UserContext";


const AccountMenuBtn = () => {

  const navigate  = useNavigate();  
  const { logout, } = useAuthServices();
  const { userData } = useUserServices();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log("TESTING USER DATA", userData)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="accout of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        sx={{
          mr: 1.5,
          color: "#000",
          "&:hover": {
            color: "#00DE49",
            bgcolor: "#000",
          },
          bgcolor: "#E0E0E0", // Customize background color
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Add elevation
        }}
      >
        <AccountCircleIcon />
      </IconButton>

      <Menu   
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Typography variant="subtitle1">Account</Typography>
        </MenuItem>

        <MenuItem>
          <Typography variant="body2">
            Available funds: ${userData.available_funds}
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => navigate("/addfunds")}>
          <Typography variant="body2">Add Funds</Typography>
        </MenuItem>

        <MenuItem onClick={logout}>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>

      </Menu>
    </>
  );
};
export default AccountMenuBtn;
