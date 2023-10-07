import { AppBar, Toolbar, Typography, Box, IconButton, Drawer } from "@mui/material";
import { Link } from "react-router-dom";
import CasinoIcon from "@mui/icons-material/Casino";
import { useResponsiveDrawer } from "../PrimaryDraw/Drawer/useResponsive";

import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

import AccountButton from "./AccountButton";

function PrimaryAppBar() {
  const theme = useTheme();

  const { isDrawerVisible, toggleDrawer } = useResponsiveDrawer();

  return (
    <>
      <AppBar
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          // backgroundImage: "url(https://source.unsplash.com/random/?stars)"
          // backgroundImage: `url(${emblem})`,
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            height: theme.primaryAppBar.height,
            minHeight: theme.primaryAppBar.height,
          }}
        >
          <Box sx={{ display: { xs: "block", sm: "none", mr: 10 } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 0.75 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Drawer anchor="left" open={isDrawerVisible} onClose={toggleDrawer(false)}>
            {[...Array(100)].map((_, i) => (
              <Typography key={i} paragraph>
                {i + 1}
              </Typography>
            ))}
          </Drawer>

          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{
                display: { fontWeight: 900, letterSpacing: "0.25px", color: "black" },
              }}
            >
              Bet On This
            </Typography>
          </Link>
          <CasinoIcon sx={{ marginLeft: "3px" }} />
          <Box sx={{ flexGrow: 1 }}></Box>
          <AccountButton />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default PrimaryAppBar;
