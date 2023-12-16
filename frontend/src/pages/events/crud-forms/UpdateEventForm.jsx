// Importing necessary React hooks, context, Material-UI components, and custom hooks
import React, { useEffect, useState } from "react";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Button, Typography, Snackbar, Box
} from "@mui/material";
import useCrud from "../../../services/useCrud";
import EditIcon from "@mui/icons-material/Edit";

// UpdateEventForm component: Manages the update functionality for an event
const UpdateEventForm = ({ openUpdateEventForm, toggleEventForm }) => {
    // Accessing event data from context
    const { event, updateEventData } = useEventData();
    // console.log("TESTING event data input", event)
    // CRUD operations custom hook
    const { updateObject } = useCrud();

    // State for managing Snackbar notifications
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // State for holding and managing event details
    const [eventDetails, setEventDetails] = useState({
        // Initializing with existing event data
        id: event.id,
        group_id: event.group.id,
        organizer: event.organizer,
        team1: event.team1,
        team2: event.team2,
        start_time: formatDateTimeForInput(event.start_time),
        end_time: formatDateTimeForInput(event.end_time),
    });

    // Function to format date-time for the input fields
    function formatDateTimeForInput(dateTime) {
        const dateObj = new Date(dateTime);
        return dateObj.toISOString().slice(0, 16);
    }

    // useEffect hook to update state when event data changes
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

    // Handler for input changes, updating eventDetails state
    const handleInputChange = (e) => {
        setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
    };

    // Async function to handle form submission
    const handleSubmit = async () => {
        try {
            console.log('Event ID:', event.id); // Debugging
            console.log('Event Details:', eventDetails); // Debugging
            const updatedEventObject = await updateObject('/events/', event.id, eventDetails);
            console.log('Updated Event Object:', updatedEventObject); // Debugging
            handleSuccess(updatedEventObject);
        } catch (error) {
            handleError(error);
        }
    };

    // Handling successful update
    const handleSuccess = (updatedEventObject) => {
        console.log(updatedEventObject)
        updateEventData(updatedEventObject) // Update context with the new event data
        toggleEventForm();
        setSnackbarMessage("Event updated successfully!");
        setSnackbarOpen(true);
    };

    // Handling errors during update
    const handleError = (error) => {
        let errorMessage = "Error updating event.";
        if (error.response && error.response.data && error.response.data.detail) {
            errorMessage = error.response.data.detail;
        }
        console.log("Error Message: ", errorMessage);
        setSnackbarMessage(errorMessage);
        setSnackbarOpen(true);
    };

    // useEffect for debugging: Manually trigger the Snackbar for testing
    useEffect(() => {
        console.log("Snackbar Open: ", snackbarOpen);
        setSnackbarMessage("Test error message");
        setSnackbarOpen(true);
    }, []);

    return (
        <>
        {/* Dialog component for the update event form */}
        <Dialog
            open={openUpdateEventForm}
            onClose={toggleEventForm}
            aria-labelledby="update-event-dialog"
        >
            {/* Dialog Title: Displaying the title with custom styling and icons */}
            <DialogTitle id="update-event-dialog" sx={{ textAlign: 'center', backgroundColor: '#000', color: 'white', fontFamily: '"Times New Roman", serif', borderBottom: '2px solid gold' }}>
                <Typography variant="h6">
                    <EditIcon sx={{ verticalAlign: 'middle' }} /> Update Event <EditIcon sx={{ verticalAlign: 'middle' }} />
                </Typography>
            </DialogTitle>

            {/* Dialog Content: Form fields for updating event details */}
            <DialogContent sx={{ backgroundColor: '#0000', color: 'white', fontFamily: 'Arial, sans-serif', mt:3 }}>
                {/* Text Field for Team 1 Name */}
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
                {/* Text Field for Team 2 Name */}
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
                {/* Text Field for Start Time */}
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
                {/* Text Field for End Time */}
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

            {/* Dialog Actions: Buttons for submitting or canceling the update */}
            <DialogActions sx={{ backgroundColor: '#000', padding: '20px', justifyContent: 'center' }}>
                {/* Cancel Button */}
                <Button onClick={toggleEventForm} color="primary" variant="outlined" sx={{ marginRight: '10px', backgroundColor: '#000', color: 'white' }}>
                    Cancel
                </Button>
                {/* Update Button */}
                <Button onClick={handleSubmit} color="primary" variant="outlined" sx={{ backgroundColor: '#000', color: '#00DE49' }}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>

    {/* Snackbar for displaying notifications */}  
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    zIndex: (theme) => theme.zIndex.tooltip + 1, // Higher than most other components
                    marginTop: '140px',
                }}
                />    
        </>
    );
};

export default UpdateEventForm;
