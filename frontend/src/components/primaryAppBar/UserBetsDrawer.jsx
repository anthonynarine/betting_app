import React, { useState, useEffect } from "react";
import { Box, Drawer, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BetList from "../../pages/events/bets/BetList";

function UserBetsDrawer({ isOpen, toggleDrawer }) {
  const theme = useTheme();

  const list = () => (
    <Box
      sx={{ paddingTop: theme.primaryAppBar.height, minWidth: 200 }}
      role="presentation"
      onclick={toggleDrawer(false)}
    //   onkeydown={toggleDrawer(false)}
    >
      <BetList />
    </Box>
  );

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
}

export default UserBetsDrawer;