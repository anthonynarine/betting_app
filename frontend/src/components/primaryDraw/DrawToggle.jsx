import { IconButton, Box } from "@mui/material";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";

const DrawerToggle = ({open, openDrawer, closeDrawer}) => {

  return (
    <Box
      sx={{
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconButton onClick={open ? closeDrawer : openDrawer}>
        {open ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
    </Box>
  );
};

export default DrawerToggle;
