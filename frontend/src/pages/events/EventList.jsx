import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
} from "@mui/material";
import { useGroupData } from "../../context/groupData/GroupDataProvider";
import { useParams } from "react-router-dom";
import { PlaceBetBtn } from "./bets/placeBetBtn/PlaceBetBtn";
import CountDownTimer from "./EventCountDownTimer";
import PaginationComponet from "../../components/pagination/PaginationComponent";


function EventList() {
  const { groups, updateEvent, deleteEvent } = useGroupData();
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
  const handlePageChange = useCallback((newPage) => {
    const start = newPage * itemsPerPage;
    const end = start + itemsPerPage;
    setCurrentPageEvents(events.slice(start, end));
    setPage(newPage); // Update the current page
  }, [itemsPerPage, events, setPage]);
  

  // BetForm functionality
  const [isBetFormOpen, setIsBetFormOpen] = useState(false);

  const toggleBetForm = useCallback((eventId) =>{
    setIsBetFormOpen((preIsBetFormOpen) => !preIsBetFormOpen);
  },[])

  const handleUpdateEvent = async(eventId, betData) => {
    try {
      await updateEvent(eventId, {...betData});
    } catch (error) {
      console.error("Failed to place/update bet:", error)
    }
  };
  
  const handleDeleteBet = async(eventId) => {
    try {
      await deleteEvent(eventId); 
    } catch (error) {
      console.error("Failed to delete bet:", error)
    }
  };



  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 6, maxWidth: 'md', mx: "auto" }}>
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
                  <PlaceBetBtn 
                    // bet={bet ? bet : {}}
                    toggleBetForm={()=> toggleBetForm(event.id)}
                    onUpdateBet={(betData) => handleUpdateEvent(event.id, betData)}
                    onDeleteBet={() => handleDeleteBet(event.id)}
                  />
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
          <PaginationComponet
                totalItems={events.length}
                itemsPerPage={itemsPerPage}
                onChangePage={handlePageChange}
            />
    </>
  );
}

export default EventList;
