import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  IconButton,
  TablePagination // We won't use TablePagination but including for completeness if needed later
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useGroupData } from "../../context/groupData/GroupDataProvider";
import { useParams } from "react-router-dom";
import CountDownTimer from "./EventCountDownTimer";
import PaginationComponent from "../../components/pagination/PaginationComponent"; // Ensure the correct import path

function EventList() {
  const { groups } = useGroupData();
  const { groupId } = useParams();

  // Find the specific group by ID
  const group = groups.find((group) => group.id === parseInt(groupId, 10));
  const events = group ? group.events : [];

  // Pagination functionality
  const [currentPageEvents, setCurrentPageEvents] = useState([]);
  const [page, setPage] = useState(0); // Add state to manage the current page (for PaginationComponent)
  const itemsPerPage = 5;

  useEffect(() => {
    handlePageChange(page); // Call on component mount and when page changes
  }, [events, page]); // Ensure effect runs when events change or page changes

  // Callback function to update the current items based on page change
  const handlePageChange = (newPage) => {
    const start = newPage * itemsPerPage;
    const end = start + itemsPerPage;
    setCurrentPageEvents(events.slice(start, end));
    setPage(newPage); // Update the current page
  };

  const betIcon = (event) => {
    const hasBet = Math.random() > 0.5; // Placeholder logic
    return hasBet ? <VisibilityIcon /> : <CasinoIcon />;
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 'md', mx: "auto" }}>
        <Table aria-label="event table">
          <TableHead>
            <TableRow>
              <TableCell>Team 1</TableCell>
              <TableCell>Team 2</TableCell>
              <TableCell>Event Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell component="th" scope="row">{event.team1}</TableCell>
                <TableCell>{event.team2}</TableCell>
                <TableCell><CountDownTimer event={event}/></TableCell>
                <TableCell>
                  {/* Here you can use your betIcon function or PlaceBetBtn component */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {/* You can adjust the colspan as per your table structure */}
              <TableCell colSpan={4} style={{ textAlign: 'center' }}>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

export default EventList;
