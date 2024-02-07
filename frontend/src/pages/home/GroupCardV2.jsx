// Mut tools
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Stack,
    Button,
    CardActionArea,
    CardActions,
    Grid
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';


export default function GroupCardV2({ group }) {
    const cardImageURL = "https://source.unsplash.com/random/?plants"
    const avatarURL = "https://source.unsplash.com/random/?animal"
    console.log(group);
    // 
    return (

        <Card>
            {/* <CardActionArea> */}
            {/* <CardMedia
                    component="img"
                    height="140"
                    image={cardImageURL}
                    alt="Group Event Image"
                /> */}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
                    {group.name.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {group.description.toUpperCase()}
                </Typography>
                <Typography variant="body2">
                    NUMBER OF EVENTS: {group.events.length}
                </Typography>
            </CardContent>
            {/* </CardActionArea> */}
            <CardActions>
                <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                    {group.members.length} {group.members.length > 1 ? ` Members` : ` Member`}
                </Typography>
                <Grid>
                    <Button
                        variant="contained"
                        endIcon={<LoginIcon />}
                        size="small"
                        color="secondary"
                        href={`/group/${group.id}`}
                        sx={{ marginRight: "8px", marginBottom: "6px", maxWidth: "145px", maxHeight: "45px" }}>
                        Join Group
                    </Button>
                </Grid>
            </CardActions>
        </Card >
    );
}