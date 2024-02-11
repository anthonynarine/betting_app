import React, { useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useBetData } from '../../../context/bet/BetDataProvider';
import { useUserServices } from '../../../context/user/UserContext';
import BetCard from './BetCard'; // Import the BetCard component

const BetList = () => {
  const { bets } = useBetData();
  const { userData } = useUserServices();

  const [openBetFormId, setBetFormOpenId] = useState(false);
  const toggleBetForm = (betId) => {
    setBetFormOpenId(prevId => prevId === betId ? null : betId);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {bets && bets.length > 0 ? (
          bets.map((bet) => (
            <Grid item key={bet.id} xs={12}>
              <BetCard
                bet={bet}
                userData={userData}
                toggleBetForm={() => toggleBetForm(bet.id)}
                openBetFormId={openBetFormId === bet.id}
                
              />
            </Grid>
          ))
        ) : (
          <Typography variant="subtitle1" sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
            No bets placed yet.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default BetList;





