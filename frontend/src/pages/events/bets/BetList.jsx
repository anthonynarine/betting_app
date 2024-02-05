import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useBetData } from '../../../context/bet/BetDataProvider';
import { useUserServices } from '../../../context/user/UserContext';

const BetList = () => {
  const { bets } = useBetData();
  const { userData } = useUserServices();


  const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5', 
    padding: '8px 16px',
    margin: '8px 0',
    borderRadius: '4px',
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {bets && bets.length > 0 ? (
          bets.map((bet) => {
      
            const numberOfParticipants = bet.event.participants_bets_and_winnings.participants_info.length;
            const currentUserBetInfo = bet.event.participants_bets_and_winnings.participants_info.find(participant => participant.user === userData.username);
            const totalWinnablePool = currentUserBetInfo ? currentUserBetInfo.total_winnable_pool : 0;
            const potentialWinning = currentUserBetInfo ? currentUserBetInfo.potential_winning : 0;

            return (
              <Grid item key={bet.id} xs={12} sm={6} md={4}>
                <Card  sx={{ minWidth: 275, maxWidth: 345, m: 'auto', backgroundColor: 'black' }}>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom sx={{color: "white"}}>
                      {bet.event.group.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="white">
                      {bet.event.team1} vs {bet.event.team2}
                    </Typography>
                    <List sx={{ padding: 0 }}>
                      <ListItem sx={listItemStyle}>
                        <ListItemText primary={`Bet on: ${bet.chosen_team_name}`} />
                      </ListItem>
                      <ListItem sx={listItemStyle}>
                        <ListItemText primary={`Amount: $${bet.bet_amount}`} />
                      </ListItem>
                      <ListItem sx={listItemStyle}>
                        <ListItemText primary={`Type: ${bet.bet_type}`} />
                      </ListItem>
                      <ListItem sx={listItemStyle}>
                        <ListItemText primary={`Participants: ${numberOfParticipants}`} />
                      </ListItem>
                      <ListItem sx={listItemStyle}>
                        <ListItemText primary={`Total Winnable Pool: $${totalWinnablePool}`} />
                      </ListItem>
                      <ListItem sx={listItemStyle}>
                        <ListItemText primary={`Your Potential Winning: $${potentialWinning}`} />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
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




  