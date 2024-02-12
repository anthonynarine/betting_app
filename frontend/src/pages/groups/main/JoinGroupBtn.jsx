import React, { useState, } from "react";
import { Button, Tooltip, Snackbar, Box, IconButton, Icon, Grow } from "@mui/material";
import { useGroupData } from "../../../context/groupData/GroupDataProvider";
import useCrud from "../../../services/useCrud";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

export const JoinGroupBtn = ({ groupId }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { updateGroups } = useGroupData();
  const { createObject } = useCrud();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }


  const handleJoinGroup = async () => {
    try {
      // Step 1: Attempt to join the group
      const newMemberData = await createObject(`/groups/${groupId}/join/`, {});
      updateGroups(groupId, "add", newMemberData);
      setSnackbarMessage("Successfully joined the group");
      setOpenSnackbar(true);
    } catch (error) {
      let errorMessage = "Failed to join group"; // Default error message
      if (error.response && error.response.data && error.response.data.message) { // Corrected syntax here
        // Extract the message from the error response
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Fallback to generic error message if available
        errorMessage = error.message; // Removed extra period here
      }
      setSnackbarMessage(errorMessage); // Use the errorMessage variable
      setOpenSnackbar(true);
    }
  };
  

  return (
    <>
      <IconButton
        aria-label="join group"
        size="small"
        color="secondary"
        onClick={handleJoinGroup}
      >
        <AddCircleOutlineOutlinedIcon />
      </IconButton>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        TransitionComponent={Grow}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
  
      />
    </>
  );
};