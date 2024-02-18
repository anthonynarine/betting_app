import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    CardActions,
    Grid,
    useTheme,
} from '@mui/material';
import CreateEventForm from '../events/crud-forms/CreateEventForm';
import { useState } from 'react';
// Icons
import AddBoxIcon from '@mui/icons-material/AddBox'; import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NearMeIcon from '@mui/icons-material/NearMe';
import { MembershipToggleButton } from '../groups/members/MembershipToggleButton';




export default function GroupCardV2({ group }) {

    const theme = useTheme();
    const { name, events, members, location } = group;

    const [openCreateEventForm, setCreateEventFormOpen] = useState(false);
    const toggleCreateEventForm = () => setCreateEventFormOpen(!openCreateEventForm);

    return (
        <Card sx={{ width: { xs: '90%', sm: 450, md: 650 } }}>

            <CardContent>
                <Typography gutterBottom variant="h4" component="div" fontWeight="bold">
                    {name.toUpperCase()}
                </Typography>
                <Stack direction="row">
                    <EventAvailableIcon fontSize="medium" sx={{ marginRight: ".3rem", paddingTop: ".1rem" }} />
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ ml: ".1rem", mr: ".5rem" }}>
                        Number of Events:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="medium">
                        {events.length}
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <GroupsIcon fontSize="medium" sx={{ marginRight: ".3rem", paddingTop: ".1rem" }} />
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ ml: ".1rem", mr: ".5rem" }}>
                        Members:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="medium">
                        {members.length}
                    </Typography>
                </Stack>
                <MembershipToggleButton groupId={group.id} />
            </CardContent>
            <CardActions>
                <NearMeIcon fontSize="medium" sx={{ marginLeft: ".4rem", paddingTop: ".1rem" }} />
                <Typography variant="body2" fontWeight="medium" sx={{ ml: ".5rem" }}>
                    {location}
                </Typography>
                <Grid sx={{ ml: "auto" }}>
                    <Button
                        onClick={toggleCreateEventForm}
                        variant="contained"
                        endIcon={<AddBoxIcon />}
                        size="small"
                        color="secondary"
                        // href={`/group/${group.id}`} // Should not use HREF, needs to use Link from React-Router
                        sx={{ marginRight: ".6rem", marginBottom: ".5rem", maxWidth: "145px", maxHeight: "30px" }}>
                        Add Event
                    </Button>
                    <CreateEventForm
                        openCreateEventForm={openCreateEventForm}
                        toggleCreateEventForm={toggleCreateEventForm}
                        groupId={group.id}
                    />
                </Grid>
            </CardActions>
        </Card >
    );
}