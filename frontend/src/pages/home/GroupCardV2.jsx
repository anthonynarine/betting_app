import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    CardActions,
    Grid,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export default function GroupCardV2({ group }) {

    const { name, events, members, location } = group;

    return (
        <Card sx={{ width: { xs: '90%', sm: 450, md: 650 } }}>

            <CardContent>
                <Typography gutterBottom variant="h4" component="div" fontWeight="bold">
                    {name.toUpperCase()}
                </Typography>
                <Stack direction="row">
                    <Typography variant="subtitle1" fontWeight="medium">
                        Number of Events:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="medium">
                        {events.length}
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <Typography variant="subtitle1" fontWeight="medium">
                        Number of Members:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="medium">
                        {members.length}
                    </Typography>

                </Stack>
            </CardContent>

            <CardActions>
                <Typography variant="body2" fontWeight="medium" sx={{ ml: ".5rem" }}>
                    {location}
                </Typography>
                <Grid sx={{ ml: "auto" }}>
                    <Button
                        variant="contained"
                        endIcon={<LoginIcon />}
                        size="small"
                        color="secondary"
                        href={`/group/${group.id}`} // Should not use HREF, needs to use Link from React-Router
                        sx={{ marginRight: "8px", marginBottom: "6px", maxWidth: "145px", maxHeight: "45px" }}>
                        Join Group
                    </Button>
                </Grid>
            </CardActions>
        </Card >
    );
}