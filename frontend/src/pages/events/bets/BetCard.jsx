import React from 'react';
import { Card, CardContent, Typography, Divider, Grid, Box } from '@mui/material';
import { PlaceBetBtn } from './placeBetBtn/PlaceBetBtn'; // Adjust the import path as needed
import BetForm from './BetForm'; 

const BetCard = ({ bet, userData, toggleBetForm, openBetFormId }) => {
  // Extract necessary data from the bet object
  const currentUserBetInfo = bet.event.participants_bets_and_winnings.participants_info.find(participant => participant.user === userData.username);
  const totalWinnablePool = currentUserBetInfo ? currentUserBetInfo.total_winnable_pool : 0;
  const potentialWinning = currentUserBetInfo ? currentUserBetInfo.potential_winning : 0;

  return (
    <Card sx={{ m: 'auto', bgcolor: 'background.paper', boxShadow: 3 }}>
      <CardContent>
        {/* Header with Group Name and Event Matchup */}
        <Grid container alignItems="center" justifyContent="flex-start">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', display: 'inline' }}>
            {bet.event.group.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ flexGrow: 1, textAlign: 'center', color: 'text.secondary', display: 'inline' }}>
            {bet.event.team1} vs {bet.event.team2}
          </Typography>
          <Box ml={2}>
            <Box sx={{ pt: 1, pr: 1, pb: 1 }} display="flex" justifyContent="center" flexGrow={1}>
              <PlaceBetBtn toggleBetForm={toggleBetForm} bet={bet} />
              <BetForm open={openBetFormId} onClose={toggleBetForm} bet={bet} />
            </Box>
          </Box>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Bet Details */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Bet on: <span style={{ fontWeight: 'bold' }}>{bet.chosen_team_name}</span> - Amount: <span style={{ fontWeight: 'bold' }}>${bet.bet_amount}</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Total Pool: <span style={{ fontWeight: 'bold' }}>${totalWinnablePool}</span> - Participants: <span style={{ fontWeight: 'bold' }}>{bet.event.participants_bets_and_winnings.participants_info.length}</span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
              Potential Winning: <span style={{ fontWeight: 'bold' }}>${potentialWinning}</span>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BetCard;
