import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function MultiActionAreaCard({ group }) {
    const cardImageURL = "https://npr.brightspotcdn.com/dims4/default/cbb3940/2147483647/strip/true/crop/6016x4016+0+0/resize/880x587!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Fcd%2Fbb%2F83b9caa44455a5b528e89edbc1cd%2Fvecteezy-man-at-a-football-match-follows-the-odds-and-the-current-25482396-665.jpg"
    const avatarURL = "https://media.npr.org/assets/img/2013/09/27/m_017_dja_06081crop_-83201a29-fae8-e211-86ee-4040e990bee0-_lg-d5be7edbb70301240aefa4f25872b9abbc7bdd29.jpg"
    const groupNameUppercase = group.name.toUpperCase();

    // 
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