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
import { Link } from 'react-router-dom';
import CreateEventForm from '../events/forms/CreateEventForm';
import { useState } from 'react';
// Icons
import AddBoxIcon from '@mui/icons-material/AddBox'; import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import InfoIcon from '@mui/icons-material/Info';
import { MembershipToggleButton } from '../group/members/MembershipToggleButton';




export default function GroupCardV2({ group }) {

    const theme = useTheme();
    const { name, events, members } = group;

    const [openCreateEventForm, setCreateEventFormOpen] = useState(false);
    const toggleCreateEventForm = () => setCreateEventFormOpen(!openCreateEventForm);

    return (
        <Card sx={{ width: { xs: '90%', sm: 450, md: 650 } }}>
            <CardContent>
                <Typography gutterBottom variant="h4" component="div" fontWeight="bold">
                    <Link to={`/group/${group.id}`} style={{ textDecoration: "none", color: theme.palette.primary.dark}} >{name.toUpperCase()}</Link>
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
                <Grid container sx={{ ml: "auto", justifyContent:"space-between"}}>
                <Grid item>
                <Button
                    variant="contained"
                    endIcon={<InfoIcon />}
                    size="small"
                    color="primary"
                    component={Link}
                    to={`/group/${group.id}`}
                    sx={{ marginLeft: ".6rem", marginBottom: ".5rem", maxWidth: "145px", maxHeight: "30px", bgcolor: "#000000", color: "#ffffff" }}>
                    View
                </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={toggleCreateEventForm}
                        variant="contained"
                        endIcon={<AddBoxIcon />}
                        size="small"
                        color="secondary"
                        sx={{ marginRight: ".6rem", marginBottom: ".5rem", maxWidth: "145px", maxHeight: "30px" }}>
                        Add Event
                    </Button>
                    <CreateEventForm
                        openCreateEventForm={openCreateEventForm}
                        toggleCreateEventForm={toggleCreateEventForm}
                        groupId={group.id}
                    />
                    </Grid>
                </Grid>
            </CardActions>
        </Card >
    );
}