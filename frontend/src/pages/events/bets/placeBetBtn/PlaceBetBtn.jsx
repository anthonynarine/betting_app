import React, { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'; // For placing a new bet
import EditIcon from '@mui/icons-material/Edit'; // For editing an existing bet
import DeleteIcon from '@mui/icons-material/Delete'; // For deleting an existing bet
import { PlaceBetBtnStyles } from "./placeBetBtnStyles";
import useCrud from "../../../../services/useCrud";
import { useGroupData } from "../../../../context/groupData/GroupDataProvider";

export const PlaceBetBtn = ({ bet, toggleBetForm, eventId}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  console.log("testing bet", bet)

  const { updateObject, deleteObject } = useCrud();
  const { fetchAllAndUserEvents } = useGroupData()
  const theme = useTheme();
  const classes = PlaceBetBtnStyles(theme);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Event time calculations
  const eventStartTime = new Date(bet?.event?.start_time).getTime();
  const eventEndTime = new Date(bet?.event?.end_time).getTime();

  // Event status
  const eventInProgress = currentTime >= eventStartTime && currentTime <= eventEndTime;
  const eventHasEnded = currentTime > eventEndTime;

  // Editability
  const canEditBet = bet && !eventInProgress && !eventHasEnded;

  const updateEvent = useCallback(async (updatedEventData) =>{
    try {
      await updateObject("/events/", eventId, updatedEventData);
      fetchAllAndUserEvents()
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  },[eventId]);
  
  const deleteEvent = useCallback(async () =>{
    try {
      await deleteObject("/events/", eventId);
      fetchAllAndUserEvents();
    } catch (error) { 
      console.error("Failed to delete event:", error);
    }
  }, [eventId])

  let buttonElement;

  if (!bet) {
    // Scenario: No bet exists
    buttonElement = (
      <Tooltip title="Place Bet" placement="top">
        <IconButton onClick={() => toggleBetForm('new', bet?.event)} sx={classes.placeBet}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    );
  } else if (canEditBet) {
    // Scenario: Bet exists and can be edited
    buttonElement = (
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
        <Tooltip title="Edit Bet" placement="top">
          <IconButton onClick={() => toggleBetForm('edit', bet)} sx={classes.placeBet}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Bet" placement="top">
          <IconButton onClick={deleteEvent} sx={classes.placeBet}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  } else {
    // Scenario: Bet cannot be edited (event in progress/ended)
    buttonElement = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Optionally, display why editing/deleting is not allowed */}
        <Tooltip title="Betting closed" placement="top">
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, ...classes.disabledState }}>
            <EditIcon color="disabled" />
            <DeleteIcon color="disabled" />
          </Box>
        </Tooltip>
      </Box>
    );
  }

  return buttonElement;
};
