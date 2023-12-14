import React, { useEffect, useState } from "react";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
    Snackbar,
    Box, 
} from "@mui/material";
import useCrud from "../../../services/useCrud";
import EditIcon from "@mui/icons-material/Edit"

const UpdateEventForm = ({ openUpdateEventForm, toggleEventForm }) => {
    const { event } = useEventData();
    const { updateObject } = useCrud();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [eventDetails, setEventDetails] = useState({
        id: event.id,
        group_id: event.group.id,
        organizer: event.organizer,
        team1: event.team1,
        team2: event.team2,
        start_time: formatDateTimeForInput(event.start_time),
        end_time: formatDateTimeForInput(event.end_time),
    });

    function formatDateTimeForInput(dateTime) {
        const dateObj = new Date(dateTime);
        const localDateTime = dateObj.toISOString().slice(0, 16);
        return localDateTime;
    }

    useEffect(() => {
        if (event) {
            setEventDetails({
                id: event.id,
                group_id: event.group.id,
                organizer: event.organizer,
                team1: event.team1,
                team2: event.team2,
                start_time: formatDateTimeForInput(event.start_time),
                end_time: formatDateTimeForInput(event.end_time),
            });
        }
    }, [event]);

    const handleInputChange = (event) => {
        setEventDetails({ ...eventDetails, [event.target.name]: event.target.value });
    };

    const handleSubmit = async () => {
        try {
            const updatedEventObject = await updateObject(`/events/${event.id}/`, eventDetails);
            handleSuccess(updatedEventObject);
        } catch (error) {
            handleError(error);
        }
    };

    const handleSuccess = (updatedEventObject) => {
        toggleEventForm();
        setSnackbarMessage("Event updated successfully!");
        setSnackbarOpen(true);
    };

    const handleError = (error) => {
        let errorMessage = "Error updating event.";
        if (error.response && error.response.data && error.response.data.detail) {
            errorMessage = error.response.data.detail;
        }
        console.log("Error Message: ", errorMessage); // Debugging 
        setSnackbarMessage(errorMessage);
        setSnackbarOpen(true);
    };

    // For testing: Manually trigger the Snackbar
    useEffect(() => {
        console.log("Snackbar Open: ", snackbarOpen); // Debugging 
        setSnackbarMessage("Test error message");
        setSnackbarOpen(true);
    }, []);

    return (
        <>
            <Dialog
                open={openUpdateEventForm}
                onClose={toggleEventForm}
                aria-labelledby="update-event-dialog"
            >
                <DialogTitle id="update-event-dialog" sx={{ textAlign: 'center', backgroundColor: '#000', color: 'white', fontFamily: '"Times New Roman", serif', borderBottom: '2px solid gold' }}>
                <Typography variant="h6">
                <EditIcon sx={{ verticalAlign: 'middle' }} /> Update Event <EditIcon sx={{ verticalAlign: 'middle' }} />
            </Typography>
                </DialogTitle>

                <DialogContent sx={{ backgroundColor: '#0000', color: 'white', fontFamily: 'Arial, sans-serif', mt:3 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="team1"
                        name="team1"
                        label="Team 1 Name"
                        type="text"
                        fullWidth
                        value={eventDetails.team1}
                        onChange={handleInputChange}
                        sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="team2"
                        name="team2"
                        label="Team 2 Name"
                        type="text"
                        fullWidth
                        value={eventDetails.team2}
                        onChange={handleInputChange}
                        sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="start_time"
                        name="start_time"
                        label="Start Time"
                        type="datetime-local"
                        fullWidth
                        value={eventDetails.start_time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                        margin="dense"
                        id="end_time"
                        name="end_time"
                        label="End Time"
                        type="datetime-local"
                        fullWidth
                        value={eventDetails.end_time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>

                <DialogActions sx={{ backgroundColor: '#000', padding: '20px', justifyContent: 'center' }}>
                    <Button onClick={toggleEventForm} color="primary" variant="outlined" sx={{ marginRight: '10px', backgroundColor: '#000', color: 'white'   }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="outlined" sx={{ backgroundColor: '#000', color: '#00DE49' }}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    zIndex: (theme) => theme.zIndex.tooltip + 1, // Higher than most other components
                    marginTop: '43px',
                }}
                />    
        </>
    );
};

export default UpdateEventForm;
