import React, { useState } from 'react';
import { Switch, FormControlLabel, Checkbox, Button } from '@mui/material';
import useCrud from '../../../services/useCrud';
import { useEventData } from '../../../context/eventData/EventDataProvider';


const EventStatusSwitch = ({ event }) => {
    const { deletObject } = useCrud();
    // const { event } = useEventData(); event ojbect can be taken from context as well
    const [deleteChecked, setDeleteChecked] = useState(false);

    const handleDeleteCheck = (event) => {
        setDeleteChecked(event.target.checked);
    };

    const handleDelete = async () => {
        if (deleteChecked){
            await deletObject(`/events/${event.id}/`);
             // may need to Handle post-deletion logic like updating the UI
        }
    };

    // create a variable for to hold the current time
    let now = new Date();

    // check if the the current time is within the event's start and end times
    let isInProgress = now >= new Date(event.start_time) && now <= new Date(event.end_time);

    // check if the current time is after the event's end time
    let isCompleted = now > new Date(event.end_time);

    return(
        <div>
            <FormControlLabel 
                control={
                    <Switch
                        checked={isInProgress || isCompleted}
                        disabled
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
                                backgroundColor: '#000', // Black track color when disabled
                            },
                            '& .MuiSwitch-thumb': {
                                backgroundColor: isInProgress ? '#00DE49' : 'gold', // Green thumb color when in progress
                            },
                        }}
                        />
                }
                label={isInProgress ? "In Progress" : isCompleted ? "Completed" : "Upcoming"}
                sx={{
                    color: '#00DE49'
                }}
                />
                {isCompleted && (
                    <>
                        <FormControlLabel
                            control={<Checkbox checked={deleteChecked} onChange={handleDeleteCheck} />}
                            label="Mark for deletion"
                            sx={{ color: 'white' }} 
                        />
                        <Button variant='outlined' color='secondary' onClick={handleDelete} disabled={!deleteChecked}
                            sx={{ borderColor: '#00DE49', color: '#00DE49' }}> 
                            Remove
                        </Button>
                    </>
                )}
        </div>
    )

};
export default EventStatusSwitch;