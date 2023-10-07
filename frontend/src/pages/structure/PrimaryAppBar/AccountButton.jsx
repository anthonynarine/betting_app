import React from "react";
import { IconButton, Box, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Brightness4 as Brightness4Icon } from "@mui/icons-material";
import LigtSwitch from "./LigtSwitch";


export default function AccountButton() {
  const renderMenu = (
    <Menu open={true}>
      <MenuItem>
        <Brightness4Icon sx={{ marginRight: "6px", fontSize: "20px" }} />
        <LigtSwitch />
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: { xs: "flex" } }}>
      <IconButton edge="end" color='="inherit'>
        <AccountCircle />
      </IconButton>
      {renderMenu}
    </Box>
  );
}
