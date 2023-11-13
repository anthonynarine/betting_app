import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuthServices } from "../../context/Auth/AuthServices";
import { useNavigate } from "react-router-dom";

const AccountMenuBtn = () => {

  const navitage  = useNavigate();  
  const { logout, userDetails } = useAuthServices();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
          },
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
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem >{`Available funds ${userDetails.availabel_funds}`}</MenuItem>
        <MenuItem onClick={()=> navitage("/addfunds")}>Add Funds</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};
export default AccountMenuBtn;
