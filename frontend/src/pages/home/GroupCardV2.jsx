// Mut tools
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Stack,
    Button, 
    CardActionArea,
    CardActions
  } from '@mui/material';
import Avatar from '@mui/material/Avatar';


export default function GroupCardV2({ group }) {

    console.log("Testing Data in GroupTestCard")  // DATA TEST 
    const cardImageURL = "https://source.unsplash.com/random/?plants"
    const avatarURL = "https://source.unsplash.com/random/?animal"
    const groupNameUppercase = group.name.toUpperCase();
    return (
    
        <Card sx={{ maxWidth: 250, paddingBottom: .5 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={cardImageURL}
                    alt="Group Event Image"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {groupNameUppercase}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Versus: [TEAM A] vs [TEAM B]
                        Pot: [POT AMOUNT]
                        Number of Participants: [NUMBER]
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Stack direction="row" spacing={12}>
                    <Avatar alt="Don Jon" src={avatarURL} />
                    <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        href={`/group/${group.id}`}
                        sx={{ marginLeft: "5px", marginBottom: "5px" }}>
                        Join Group
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
}