import React, { useState } from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';


const EventRow = ({ event }) => {
  const [open, setOpen] = useState(false);

  EventRow.propTypes = {
    event: PropTypes.shape({
      id: PropTypes.number.isRequired,
      team1: PropTypes.string.isRequired,
      team2: PropTypes.string.isRequired,
      start_time: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
      organizer: PropTypes.number.isRequired,
      group: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        user: PropTypes.any,
        banner_image: PropTypes.string,
      }),
      is_complete: PropTypes.bool.isRequired,
      participants_bets_and_winnings: PropTypes.shape({
        participants_info: PropTypes.arrayOf(
          PropTypes.shape({
            user: PropTypes.string.isRequired,
            bet_amount: PropTypes.number.isRequired,
            team_choice: PropTypes.string.isRequired,
            potential_winning: PropTypes.number.isRequired,
            total_winnable_pool: PropTypes.number.isRequired,
          })
        ).isRequired,
      }),
    }).isRequired,
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label={open ? "collapse row" : "expand row"} size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{event.team1} vs {event.team2}</TableCell>
        {/* <TableCell>{new Date(event.start_time).toLocaleString()}</TableCell>
        <TableCell>{new Date(event.end_time).toLocaleString()}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Bet Info</Typography>
              <Table size="small" aria-label="participants">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Team Choice</TableCell>
                    <TableCell align="right">Bet Amount</TableCell>
                    <TableCell align="right">Potential Winning</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {event.participants_bets_and_winnings.participants_info?.map((participant, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">{participant.user}</TableCell>
                      <TableCell>{participant.team_choice}</TableCell>
                      <TableCell align="right">{participant.bet_amount}</TableCell>
                      <TableCell align="right">{participant.potential_winning}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};


export default EventRow;
