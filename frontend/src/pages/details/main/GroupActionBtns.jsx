import React, { useState } from "react";
import { Button, Tooltip, Snackbar, Box } from "@mui/material";
import useAxiosWithInterceptor from "../../../services/jwtinterceptor"; // Replace with your actual import


const BASE_URL = process.env.REACT_APP_BASE_URL;

export const JoinGroupButton = ({ groupId, setIsMember }) => {
  const jwtAxios = useAxiosWithInterceptor();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
  };

  const handleJoinGroup = async () => {
    try {
      const response = await jwtAxios.post(`${BASE_URL}/groups/${groupId}/join/`);
      if (response.status === 200) {
        setOpen(true);
        setIsMember(true)

      }
    } catch (error) {
      console.error("Failed to join group:", error);
      setErrorOpen(true);

    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* <Tooltip title="Join Group" arrow> */}
          <Button
            variant="outlined"
            sx={{
              borderColor: "#000",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "15px",
              fontWeight: "500",
              textShadow: "1px 1px 2px #aaa",
              padding: "3px 12px", // Smaller padding
              fontSize: "0.875rem", // Smaller font size
              textTransform: "none",
              "&:hover": {
                borderColor: "#00DE49",
                backgroundColor: "#00DE49",
                color: "black",
              },
            }}
            onClick={handleJoinGroup}
          >
            Join
          </Button>
        {/* </Tooltip> */}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Successfully joined the group"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Failed to join the group"
      />
    </>
  );
};

export const LeaveGroupButton = ({ groupId, setIsMember }) => {
  const jwtAxios = useAxiosWithInterceptor();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await jwtAxios.post(`${BASE_URL}/groups/${groupId}/leave/`);
      if (response.status === 200) {
        setOpen(true);
        setIsMember(false)
      }
    } catch (error) {
      console.error("Failed:", error);
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* <Tooltip title="Leave Group" arrow> */}
          <Button
            variant="contained"
            sx={{
              borderColor: "#000",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "50px",
              fontWeight: "500",
              textShadow: "1px 1px 2px #555",
              padding: "6px 12px", // Smaller padding
              fontSize: "0.700rem", // Smaller font size
              textTransform: "none",
              "&:hover": {
                borderColor: "#00DE49",
                backgroundColor: "#00DE49",
                color: "black",
              },
            }}
            onClick={handleLeaveGroup}
          >
            Leave
          </Button>
        {/* </Tooltip> */}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Successfully left the group"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Failed to leave the group"
      />
    </>
  );
};
