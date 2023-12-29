import Paper from "@mui/material/Paper";
import { Typography, Box } from "@mui/material";
import { useBetData } from "../../../context/bet/BetDataProvider";

const ticketStyle = {
  padding: '20px',
  margin: '10px auto', // Center the ticket
  borderRadius: '16px', // Smoothed border radius
  border: '1px solid #000', // Dark border
  backgroundColor: '#000', // Dark background
  color: '#fff', // White text color
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Stronger shadow for depth
  maxWidth: '20rem', // Max width for the ticket
  minWidth: "20rem",
  textAlign: 'center',
};



const statusStyle = (status) => ({
  color: status === 'Won' ? '#4caf50' : status === 'Lost' ? '#f44336' : '#ffffff', 
  fontWeight: 'bold'
})

const BetDetailsCard = () => {
  const { individualBet } = useBetData();

  // Check if individualBet is either null, undefined or an empty object if any of this is true return null
  if (!individualBet || Object.keys(individualBet).length === 0) {
    return null;
  }

  return (
    <Box >
      <Paper style={ticketStyle}>
        <Typography variant="h5" gutterBottom style={{ color: '#8b4513' }}> 
          Bet Ticket
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>{individualBet.chosen_team_name}</strong> to
          <strong> Win ${individualBet.bet_amount}</strong>
        </Typography>
        <Typography style={statusStyle(individualBet.status)}>
          Status: {individualBet.status}
        </Typography>
      </Paper>
    </Box>
  );
};

export default BetDetailsCard;

