import React, { useState, useEffect } from "react";
import { Button, Tooltip, Snackbar, Box } from "@mui/material";
import useAxiosWithInterceptor from "../../../services/jwtinterceptor"; // Replace with your actual import
import { useGroupData } from "../../../context/groupData/GroupDataProvider";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const JoinGroupBtn = () => {
  const jwtAxios = useAxiosWithInterceptor();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const { members, updateMembers, groupId } = useGroupData();

//   useEffect(() => {
//     console.log("Current members:", members);
//     console.log("updateMembers is a function: ", typeof updateMembers === "function");
//   }, [members]); //DEBUT TESTS


  const handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
  };

  const handleJoinGroup = async () => {
    // Get the access token from local storage
    const accessToken = localStorage.getItem("accessToken");
  
    try {
      // Step 1: Attempt to join the group by making a POST request
      // ---------------------------------------------------------
      const joinResponse = await jwtAxios.post(
        `${BASE_URL}/groups/${groupId}/join/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      // Check if the join request was successful
      if (joinResponse.status === 200) {
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
      // Handle any errors that occur during the join or fetch operations
      console.error("Failed to join group:", error);
  
      // Open the error Snackbar
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Successfully joined the group"
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Failed to join the group"
      />
    </>
  );
};