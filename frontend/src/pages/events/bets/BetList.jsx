// Import necessary hooks and components from React and Material-UI
import React, { useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';

// Import context hooks for accessing global state
import { useBetData } from '../../../context/bet/BetDataProvider';
import { useUserServices } from '../../../context/user/UserContext';
import BetCard from './BetCard';

const BetList = () => {

  const { bets } = useBetData();
  const { userData } = useUserServices();

  // State to manage which bet's form is open. Initially, no form is open (set to false).
  const [openBetFormId, setBetFormOpenId] = useState(false);

  // Function to toggle the bet form's visibility
  const toggleBetForm = (betId) => {
    // Update the state based on the previous state and the current bet ID.
    // If the current bet ID is the same as the one already open, close the form (set to null).
    // Otherwise, open the form for the current bet ID.
    setBetFormOpenId(prevId => prevId === betId ? null : betId);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Check if there are bets and map over them to display each BetCard */}
        {bets && bets.length > 0 ? (
          bets.map((bet) => (
            <Grid item key={bet.id} xs={12}>
              {/* Render a BetCard for each bet */}
              <BetCard
                bet={bet}
                userData={userData}
                // Pass a function to toggle the form for this specific bet
                toggleBetForm={() => toggleBetForm(bet.id)}
                // Determine if the form for this bet should be open
                openBetFormId={openBetFormId === bet.id}
              />
            </Grid>
          ))
        ) : (
          // Display a message if there are no bets
          <Typography variant="subtitle1" sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
            No bets placed yet.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default BetList;





