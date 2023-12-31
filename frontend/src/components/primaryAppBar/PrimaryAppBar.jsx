import { AppBar, Toolbar, Typography, Box, IconButton, Drawer } from "@mui/material";
import { Link } from "react-router-dom";
import CasinoIcon from "@mui/icons-material/Casino";
import { useResponsiveDrawer } from "../primaryDraw/useResponsive"; 
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

import LoginLogoutButton from "./LoginLogoutButton";
import { useAuthServices } from "../../context/Auth/AuthServices";


function PrimaryAppBar() {
  const theme = useTheme();

  const { isDrawerVisible, toggleDrawer } = useResponsiveDrawer();

  const { isLoggedIn } = useAuthServices();


  return (
    <>
      <AppBar
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          // backgroundImage: "url(https://source.unsplash.com/random/?green)"
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
              Bet on This
            </Typography>
          </Link>
          <CasinoIcon sx={{ marginLeft: "3px" }} />
          <Box sx={{ flexGrow: 1 }}></Box>
   
          <LoginLogoutButton />
          {/* <AccountButton /> */}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default PrimaryAppBar;
