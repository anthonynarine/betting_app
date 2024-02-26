import React, { useState } from 'react';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CountDownTimer from '../main/EventCountDownTimer';
import EventActions from '../EventAction';
import UpdateEventForm from "../forms/UpdateEventForm"


const EventRow = ({ event }) => {
  const theme = useTheme();
  const matchesSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [open, setOpen] = useState(false);
  const [openUpdateEvenForm, setOpenUpdateEventForm] = useState(false);

  const toggleEventForm = () => {setOpenUpdateEventForm(!openUpdateEvenForm)};

 
    


  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, }}>
        <TableCell>
          <IconButton aria-label={open ? "collapse row" : "expand row"} size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {matchesSmallScreen ? (
          // For small screens: Just show "Team1 vs Team2" with the ability to expand for more details
          <TableCell component="th" scope="row" colSpan={5}>{event.team1} vs {event.team2}</TableCell>
        ) : (
          <>
          <TableCell component="th" scope="row">{event.team1} vs {event.team2}</TableCell>
          <TableCell><CountDownTimer event={event}/></TableCell>
          {/* Add Place Bet Button here for larger screens */}
          {!matchesSmallScreen && (
              <TableCell>
                <EventActions event={event} toggleEventForm={toggleEventForm} />
                <UpdateEventForm openUpdateEventForm={openUpdateEvenForm} toggleEventForm={toggleEventForm} event={event} />
              </TableCell>
          )}
      </>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Bet Info</Typography>
              <Table size="small" aria-label="participants">
                <TableHead>
                  <TableRow>
                    {matchesSmallScreen ? (
                      // For small screens: Show simplified headers or modify as needed
                      <>
                        <TableCell>Team Choice</TableCell>
                        <TableCell align="right">Bet Amount</TableCell>
                        <TableCell align="right">Potential Winning</TableCell>
                      </>
                    ) : (
                      // For larger screens: Include all headers
                      <>
                        <TableCell>User</TableCell>
                        <TableCell>Team Choice</TableCell>
                        <TableCell align="right">Bet Amount</TableCell>
                        <TableCell align="right">Potential Winning</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {event.participants_bets_and_winnings.participants_info?.map((participant, index) => (
                    <TableRow key={index} >
                      {matchesSmallScreen ? (
                        // For small screens: Only display the essential information
                        <>
                          <TableCell>{participant.team_choice}</TableCell>
                          <TableCell align="right">{participant.bet_amount}</TableCell>
                          <TableCell align="right">{participant.potential_winning}</TableCell>
                        </>
                      ) : (
                        // For larger screens: Display all details
                        <>
                          <TableCell component="th" scope="row">{participant.user}</TableCell>
                          <TableCell>{participant.team_choice}</TableCell>
                          <TableCell align="right">{participant.bet_amount}</TableCell>
                          <TableCell align="right">{participant.potential_winning}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default EventRow;
