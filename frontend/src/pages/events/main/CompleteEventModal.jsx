import Reactk, { useState } from "react"
import {
    Box,
    Typography,
    Modal,
    Button, 
    FormControl,
    InputLabel,
    Select, 
    MenuItem,
    Container,
} from "@mui/material";

const CompleteEventModal = ({ modalOpen, toggleModal, onEventComplete, teams }) => {
    const [winner, setWinner] = useState("");

    const handleCompleteEvent = () => {
        onEventComplete(winner);
        toggleModal();
    };

    // Styles for the modal's inner content
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-30%, -80%)',
        width: '60%', // Adjust this value to control the width
        maxWidth: '400px', // Maximum width
        minWidth: '300px', // Minimum width
        bgcolor: 'white',
        boxShadow: 24,
        p: 4, // Padding around the content
        borderRadius: 2, // Rounded corners
        textAlign: 'center',
    };

    return(
        <>
            <Modal
              open={modalOpen}
              onClose={toggleModal}
              aria-labelledby ="complete-event-modal"
              aria-describedby="complete-event-select-winner"
            >
                <Container sx={{ display: 'inline-block', width: 'auto' }}>
                    <Box sx={modalStyle}>
                        <Typography id="complete-event-modal" variant="h6" component="h2">
                            Complete Event
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="winner-select-label">Select Winner</InputLabel>
                            <Select
                                labelID="Winner-select-label"
                                id="winner-select"
                                value={winner}
                                label="Select Winner"
                                onChange={(event)=>setWinner(event.target.value)}
                                
                            >
                                {teams.map((team, index) =>(
                                    <MenuItem key={index} value={team}>
                                        {team}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button onClick={handleCompleteEvent} size="large">Complete</Button>
                        <Button onClick={toggleModal} size="large">Cancel</Button>
                    </Box>  
                </Container>          
            </Modal>   
        </>
    )
};

export default CompleteEventModal;