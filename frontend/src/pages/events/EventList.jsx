import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { useBetData } from "../../context/bet/BetDataProvider";
import { useParams } from "react-router-dom";
import { PlaceBetBtn } from "./bets/placeBetBtn/PlaceBetBtn";
import CountDownTimer from "./EventCountDownTimer";
import PaginationComponet from "../../components/pagination/PaginationComponent";
import BetForm from "./bets/BetForm";


function EventList() {
  const { groups } = useGroupData();
  const { groupId } = useParams();
  const { bets } = useBetData();

  // Find the specific group by ID
  const group = groups.find((group) => group.id === parseInt(groupId, 10));
  const events = group ? group.events : [];

  console.log("group", group)


  // Pagination functionality
  const [currentPageEvents, setCurrentPageEvents] = useState([]);
  const [page, setPage] = useState(0); // Add state to manage the current page (for PaginationComponent)
  const itemsPerPage = 5;

  // Callback function to update the current items based on page change
  const handlePageChange = useCallback((newPage) => {
    const start = newPage * itemsPerPage;
    const end = start + itemsPerPage;
    setCurrentPageEvents(events.slice(start, end));
    setPage(newPage); // Update the current page
  }, [itemsPerPage, setPage]);
  
  // useEffect(() => {
  //   handlePageChange(page); // Call on component mount and when page changes
  // }, [ page, ]); // Ensure effect runs when events change or page changes

  console.log("current page events", currentPageEvents)

  // BetForm functionality
  const [isBetFormOpen, setIsBetFormOpen] = useState(false);

  const toggleBetForm = useCallback((eventId) =>{
    setIsBetFormOpen((currentId) => currentId === eventId ? null : eventId);
  },[])

  

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
          {currentPageEvents.map((event) => {
              const userBet = bets.find(bet => bet.event.id === event.id);
              return (
                <TableRow key={event.id}>
                  <TableCell>{event.team1}</TableCell>
                  <TableCell>{event.team2}</TableCell>
                  <TableCell><CountDownTimer event={event}/></TableCell>
                  <TableCell>
                    <PlaceBetBtn 
                      bet={userBet || null}
                      eventId={event.id}
                      toggleBetForm={toggleBetForm} // Assuming this is properly defined to handle form toggling
                    />
                    {
                     isBetFormOpen && (
                      <BetForm
                        open={Boolean(isBetFormOpen)}
                        onClose={() => toggleBetForm(null)} // Close the form by resetting the activeBetEventId
                        eventId={isBetFormOpen}
                        bet={userBet}
                        // Pass any other props your BetForm might need
                      />
                    )
                  }
                  </TableCell>
                </TableRow>
              );
            })}
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
