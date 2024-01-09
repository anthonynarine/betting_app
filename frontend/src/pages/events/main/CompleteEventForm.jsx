import React, { useState, useCallback } from "react";
import CompleteEventRequest from "./CompleteEventRequest";
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


/**
 * A form presented in a modal for completing an event.
 * Allows selection of a winner from a list of teams and handles the completion process.
 *
 * Props:
 * - `modalOpen`: Boolean indicating whether the modal is open.
 * - `toggleModal`: Function to toggle the modal's open state.
 * - `teams`: Array of teams to select a winner from.
 */
const CompleteEventForm = ({ modalOpen, toggleModal, teams }) => {
    const [winner, setWinner] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isCompleting, setIsCompleting] = useState(false);

    // Styles for the modal's inner content
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-30%, -80%)',
        width: '60%',
        maxWidth: '400px',
        minWidth: '300px',
        bgcolor: 'white',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        textAlign: 'center',
    };

    // Handles successful completion of an event
    const handleSuccess = useCallback((response, message) => {
        console.log("Event Completed successfully:", response);
        setSuccessMessage(message);
        toggleModal();
    }, [toggleModal]);

    // Handles errors that occur during event completion
    const handleError = useCallback((error) => {
        console.error("Error completing event:", error);
        if (error.response && error.response.data && error.response.data.detail) {
            setErrorMessage(error.response.data.detail);
        } else {
            setErrorMessage("An error occurred trying to complete the event");
        }
    }, []);

    // Function to handle the click of the Complete button
    const handleCompleteClick = () => {
        if (!winner) {
            setErrorMessage("Please select a winner before completing the event.");
            return;
        }
        setIsCompleting(true); // Set flag to true to indicate the event is being completed
    };
    

    return (
        <>
            {/* Modal for Completing Event */}
            <Modal
                open={modalOpen} // Controls if the modal is open or closed
                onClose={toggleModal} // Function to call when modal is closed
                aria-labelledby="complete-event-modal"
                aria-describedby="complete-event-select-winner"
            >
                <Container sx={{ display: 'inline-block', width: 'auto' }}>
                    {/* Box to style the content inside the modal */}
                    <Box sx={modalStyle}>
                        {/* Title of the modal */}
                        <Typography id="complete-event-modal" variant="h6" component="h2">
                            Complete Event
                        </Typography>

                        {/* Form Control for selecting winner */}
                        <FormControl fullWidth>
                            <InputLabel id="winner-select-label">Select Winner</InputLabel>
                            <Select
                                labelId="winner-select-label"
                                id="winner-select"
                                value={winner}
                                label="Select Winner"
                                onChange={(event) => setWinner(event.target.value)} // Update winner state on change
                            >
                                {/* Mapping through teams to create menu items for each team */}
                                {teams.map((team, index) => (
                                    <MenuItem key={index} value={team}>
                                        {team}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Buttons for completing or canceling the event */}
                        <Button onClick={handleCompleteClick} size="large">Complete</Button>
                        <Button onClick={toggleModal} size="large">Cancel</Button>

                        {/* Displaying success or error messages */}
                        {successMessage && <Typography color="green">{successMessage}</Typography>}
                        {errorMessage && <Typography color="red">{errorMessage}</Typography>}
                    </Box>  
                </Container>          
            </Modal>

            {/* Conditional rendering of CompleteEventRequest */}
            {isCompleting && (
                <CompleteEventRequest
                    winner={winner}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    loadingMessage="Completing Event..."
                    successMessage="Event completed successfully"
                    errorMessage="Error completing event"
                />
            )}
        </>
    );
};

export default CompleteEventForm;