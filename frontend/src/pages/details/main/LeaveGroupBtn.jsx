import React, { useState, useEffect } from "react";
import { Button, Tooltip, Snackbar, Box } from "@mui/material";
import useAxiosWithInterceptor from "../../../services/jwtinterceptor"; // Replace with your actual import
import { useGroupData } from "../../../context/groupData/GroupDataProvider";

const BASE_URL = process.env.REACT_APP_BASE_URL;


export const LeaveGroupBtn = () => {
  const accessToken = localStorage.getItem("accessToken");
  const jwtAxios = useAxiosWithInterceptor();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const { members, updateMembers, groupId, userId } = useGroupData();

  useEffect(() => {
    console.log("Received updateMembers function: ", updateMembers);
    console.log("Received members state: ", members);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
  };

  const handleLeaveGroup = async () => {
    try {
      // Step 1: Attempt to leave the group by making a POST request
      // -----------------------------------------------------------
      const leaveResponse = await jwtAxios.post(
        `${BASE_URL}/groups/${groupId}/leave/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      // Check if the leave request was successful
      if (leaveResponse.status === 200) {
        // Open the success Snackbar
        setOpen(true);
  
        // Step 2: Fetch the updated group data to get the latest members list
        // -------------------------------------------------------------------
        const updatedGroupData = await jwtAxios.get(
          `${BASE_URL}/groups/${groupId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        // Step 3: Update the members state with the latest data
        // -----------------------------------------------------
        updateMembers(updatedGroupData.data.members);
      }
    } catch (error) {
      // Handle any errors that occur during the leave or fetch operations
      console.error("Failed to leave group:", error);
  
      // Open the error Snackbar
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Successfully left the group"
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Failed to leave the group"
      />
    </>
  );
};
