import React, { useState, useCallback } from "react";
import useCrud from "../../../services/useCrud";
import { useParams } from "react-router-dom";
import { Box, Typography, Modal, Button, FormControl, InputLabel, Select, MenuItem, Container } from "@mui/material";

const CompleteEventForm = ({ modalOpen, toggleModal, teams }) => {
    const [winner, setWinner] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { createObject } = useCrud();
    const { eventId } = useParams();

    const completeEvent = async () => {
        console.log("Completing Event...");

        const eventData = { winning_team: winner };

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

    const handleCompleteClick = () => {
        if (!winner) {
            setErrorMessage("Please select a winner before completing the event.");
            return;
        }
        completeEvent();
    };

    return (
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
