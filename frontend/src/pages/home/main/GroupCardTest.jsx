import {
    Card,
    CardContent,
    CardMedia,
    Typography,
  } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Button, CardActionArea, CardActions } from '@mui/material';


export default function GroupCardTest({ group }) {
    const cardImageURL = "https://source.unsplash.com/random/?plants"
    const avatarURL = "https://source.unsplash.com/random/?animal"
    const groupNameUppercase = group.name.toUpperCase();

    // 
    return (
    
        <Card sx={{ maxWidth: 250, paddingBottom: .5 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image="https://source.unsplash.com/random/?plants"
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