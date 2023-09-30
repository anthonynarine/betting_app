import { AppBar, Toolbar } from "@mui/material";
import React from "react";

import { useTheme } from "@mui/material/styles";

function PrimaryAppBar() {
  return (
    <>
      <AppBar>
        <Toolbar variant="dense" ></Toolbar>
      </AppBar>
    </>
  );
}

export default PrimaryAppBar;
