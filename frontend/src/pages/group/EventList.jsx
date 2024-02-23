import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino"; // Example icon for placing a bet
import VisibilityIcon from "@mui/icons-material/Visibility"; // Example icon for viewing a bet
import { useGroupData } from "../../context/groupData/GroupDataProvider";
import { useParams } from "react-router-dom";

function EventList() {
  const { groups } = useGroupData();
  const { groupId } = useParams();

  // Find the specific group by ID
  const group = groups.find((group) => group.id === parseInt(groupId, 10));
  console.log("testing groups", groups)
  console.log("testing group", group)
  const events = group ? group.events : [];
  console.log("testing events", events)


  // This function determines which icon to show based on whether the user has placed a bet
  const betIcon = (event) => {
    // Placeholder for logic to determine if a bet has been placed
    const hasBet = Math.random() > 0.5; // Randomly decides for demonstration
    if (hasBet) {
      return <VisibilityIcon />; // User has placed a bet
    }
    return <CasinoIcon />; // User hasn't placed a bet
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 'md', mx: "auto" }}>
      <Table aria-label="event table">
        <TableHead>
          <TableRow>
            <TableCell>Team 1</TableCell>
            <TableCell>Team 2</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell component="th" scope="row">
                {event.team1} {/* Updated to use group.description */}
              </TableCell>
              <TableCell>{event.team2}</TableCell>
              <TableCell>{event.endTime}</TableCell>
              <TableCell>${event.totalTeam2}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    /* logic to handle icon click */
                  }}
                >
                  {betIcon(event)}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default EventList;
