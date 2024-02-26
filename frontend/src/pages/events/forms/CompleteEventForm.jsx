import React, { useState } from "react";
import useCrud from "../../../services/useCrud";
import { useParams } from "react-router-dom";
import { Box, Typography, Modal, Button, FormControl, InputLabel, Select, MenuItem, Container } from "@mui/material";

/**
 * Component for completing an event.
 * 
 * This component displays a modal allowing the user to select a winner from a list of teams
 * and mark an event as complete. It handles both success and error states.
 * 
 * @param {Object} props - Component props.
 * @param {boolean} props.modalOpen - State to control modal visibility.
 * @param {Function} props.toggleModal - Function to toggle the modal state.
 * @param {Array} props.teams - List of teams to select a winner from.
 */
const CompleteEventForm = ({ modalOpen, toggleModal, teams }) => {
    // State to store the selected winner
    const [winner, setWinner] = useState("");

    // State to store success and error messages
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Custom hook for CRUD operations
    const { createObject } = useCrud();

    // Retrieve event ID from the URL params
    const { eventId } = useParams();

    /**
     * Handles the completion of an event.
     * 
     * Sends a request to mark an event as complete with the selected winner.
     * It updates the success or error message based on the response.
     * 
     * @param {string} winningTeam - The selected winning team.
     */
    const completeEvent = async (winningTeam) => {
        console.log("Completing Event...");

        const eventData = { winning_team: winningTeam };

        try {
            const response = await createObject(`/events/${eventId}/mark-as-complete/`, eventData);
            console.log("Event Completed successfully:", response);
            const detailMessage = response?.data?.details || "Event completed successfully";
            setSuccessMessage(detailMessage);
        } catch (error) {
            console.error("Error completing event:", error);
            const errorDetail = error.response?.data?.detail || "Error completing event";
            setErrorMessage(errorDetail);
        } finally {
            toggleModal();
        }
    };

    /**
     * Event handler for the 'Complete' button click.
     * 
     * Validates the winner selection before calling the completeEvent function.
     */
    const handleCompleteClick = () => {
        if (!winner) {
            setErrorMessage("Please select a winner before completing the event.");
            return;
        }
        completeEvent(winner);
    };

    return (
        // Modal UI component
        <Modal open={modalOpen} onClose={toggleModal} aria-labelledby="complete-event-modal" aria-describedby="complete-event-select-winner">
            <Container sx={{ display: 'inline-block', width: 'auto' }}>
                <Box sx={{
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
                }}>
                    {/* Event completion form */}
                    <Typography id="complete-event-modal" variant="h6" component="h2">
                        Complete Event
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel id="winner-select-label">Select Winner</InputLabel>
                        <Select
                            labelId="winner-select-label"
                            id="winner-select"
                            value={winner}
                            label="Select Winner"
                            onChange={(event) => setWinner(event.target.value)}
                        >
                            {teams.map((team, index) => (
                                <MenuItem key={index} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={handleCompleteClick} size="large">Complete</Button>
                    <Button onClick={toggleModal} size="large">Cancel</Button>
                    {successMessage && <Typography color="green">{successMessage}</Typography>}
                    {errorMessage && <Typography color="red">{errorMessage}</Typography>}
                </Box>
            </Container>
        </Modal>
    );
};

export default CompleteEventForm;
