import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    CardActions,
    Grid,
    useTheme,
    IconButton,
} from '@mui/material';

// Icons
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NearMeIcon from '@mui/icons-material/NearMe';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';



export default function GroupCardV2({ group }) {

    let theme = useTheme();

    const { name, events, members, location } = group;

    return (
        <Card sx={{ width: { xs: '90%', sm: 450, md: 650 } }}>

            <CardContent>
                <Typography gutterBottom variant="h4" component="div" fontWeight="bold">
                    {name.toUpperCase()}
                </Typography>
                <Stack direction="row">
                    <EventAvailableIcon fontSize="medium" sx={{ marginRight: ".3rem", paddingTop: ".1rem" }} />
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ ml: ".1rem" }}>
                        Number of Events:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="medium">
                        {events.length}
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <GroupsIcon fontSize="medium" sx={{ marginRight: ".3rem", paddingTop: ".1rem" }} />
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ ml: ".1rem" }}>
                        Members:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="medium">
                        {members.length}
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <AddCircleOutlineOutlinedIcon />
                    <Typography>
                        {group.description}
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions>
                <NearMeIcon fontSize="medium" sx={{ marginLeft: ".4rem", paddingTop: ".1rem" }} />
                <Typography variant="body2" fontWeight="medium" sx={{ ml: ".5rem" }}>
                    {location}
                </Typography>
                <Grid sx={{ ml: "auto" }}>
                    <Button
                        variant="contained"
                        endIcon={<PersonAddAlt1Icon />}
                        size="small"
                        color="secondary"
                        href={`/group/${group.id}`} // Should not use HREF, needs to use Link from React-Router
                        sx={{ marginRight: ".6rem", marginBottom: ".5rem", maxWidth: "145px", maxHeight: "30px" }}>
                        Join Group
                    </Button>
                </Grid>
            </CardActions>
        </Card >
    );
}