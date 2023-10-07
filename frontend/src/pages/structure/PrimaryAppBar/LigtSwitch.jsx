import React, { useContext } from "react";
import { ColorModeContext } from "../../../context/ColorModeContext";
import { useTheme } from "@mui/material/styles";
import { ToggleOn, ToggleOff } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

export default function LigtSwitch() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <>
      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        {theme.palette.mode} mode
      </Typography>
      <IconButton
        sx={{ m: 0, p: 0, pl: 2 }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? (
          <ToggleOff sx={{ fontSize: "2.5rem" }} />
        ) : (
          <ToggleOn sx={{ fontSize: "2.5rem" }} />
        )}
      </IconButton>
    </>
  );
}
