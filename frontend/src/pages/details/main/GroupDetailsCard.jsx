import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { JoinGroupButton, LeaveGroupButton } from "./GroupActionBtns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EventTimestamp from "./EventTimeStamp";
import { useApiData } from "../../../context/apiDataProvider/ApiDataProvider";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function GroupDetailsCard() {

  const { events, group, members, userId } = useApiData();

  console.log("GroupDetailsCard DATA", group);


  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const isMember = members
    ? members.some((member) => member.user.id === Number(userId))
    : false;


  return (
    <Card
      sx={{
        // Set initial maxWidth (for smaller screens)
        maxWidth: 300,
        // Set maxHeight for scrolling on smaller screens
        maxHeight: 650,
        overflow: "auto",
        // Rounded corners to make it look like a book
        borderRadius: "20px",
        borderColor: "#000",
        // Shadow to simulate pages
        // boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)",
        // Light background color like pages of a book
        background: "#fff",
        // CSS media query for larger screens
        "@media (min-width: 768px)": {
          // Adjust maxWidth for wider screens
          maxWidth: 700, // You can adjust this value
          // Remove maxHeight for wider screens (no scrolling)
          maxHeight: "none",
        },
      }}
      elevation={20}
    >
      <CardHeader
        // avatar={
        //   <Avatar
        //     src={"https://source.unsplash.com/random/?plant"}
        //     aria-label="movie-icon"
        //   />
        // }
        action={
          <Box
            sx={{ pt: 1.25, pr: 1 }}
            display="flex"
            justifyContent="center"
            flexGrow={1}
          >
            <>
              {isMember ? (
                <IconButton aria-label="leave-group">
                  <LeaveGroupButton/>
                </IconButton>
              ) : (
                <IconButton aria-label="join-group">
                  <JoinGroupButton
/>
                </IconButton>
              )}
            </>
          </Box>
        }
        title={<Typography variant="h6">{group.name}</Typography>}
        subheader={<Typography variant="subtitle1">{group.description}</Typography>}
      />
      <CardMedia
        component="img"
        height="300"
        image={
          group.banner_img ? group.banner_img : "https://source.unsplash.com/random/?fight"
        }
        alt="banner image"
      />
      <CardContent>
        <Box sx={{ margin: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {group.description}
          </Typography>
          {events && events.length > 0 && (
            <>
              {events.map((event) => (
                <div key={event.id}>
                  <Typography variant="h6" sx={{ marginTop: 1 }}>
                    {event.team1} Vs {event.team2}
                  </Typography>

                  <Typography
                    sx={{ display: "flex", alignItems: "center", marginTop: 2 }}
                  >
                    <EventTimestamp createdAt={new Date(event.time)} />
                  </Typography>
                </div>
              ))}
            </>
          )}
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share">
          <DeleteSweepIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Additional details can go here */}
          <Typography paragraph>
            Additional details can be added here.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
