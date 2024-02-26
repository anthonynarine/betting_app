import React from "react";
import { IconButton } from "@mui/material"; 
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EditIcon from '@mui/icons-material/Edit';
import useCrud from "../../services/useCrud";
import { useGroupData } from "../../context/groupData/GroupDataProvider";
import { useEventData } from "../../context/eventData/EventDataProvider";

const EventActions = ({ event, toggleEventForm }) => {

    const now = new Date();
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    const eventHasStarted = now >= startTime;
    const eventHasEnded = now >= endTime;

    const { deleteObject, setIsLoading, setError } = useCrud();
    const { fetchAllGroupsData } = useGroupData();
    const { fetchAllAndUserEvents } = useEventData();

    const handleDelete = async () => {
        console.log(`Deleting event with ID: ${event.id}`); 
        setIsLoading(true);
        try {
            await deleteObject('/events/', event.id)
            fetchAllGroupsData(); //updates group/id UI
            fetchAllAndUserEvents(); //updates UserEvents tab pannel UI
            setError(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Error deleting event:", error);
            setError(error);
            setIsLoading(false);
            
        }
    };

    return(
        <>
            <IconButton
                aria-label="delete"
                onClick={handleDelete}
                disabled={eventHasStarted || (eventHasEnded && !event.is_complete)}
            >
                <DeleteSweepIcon />
            </IconButton>
            <IconButton
                aria-label="update"
                onClick={toggleEventForm}
                disabled={eventHasStarted || eventHasEnded}
            >
                <EditIcon />
            </IconButton>
        </>
    )
}

export default EventActions