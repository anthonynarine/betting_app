import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import EventTimeStamp from "../../details/main/EventTimeStamp";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

//bet
import { PlaceBetBtn } from "./bet_crud/placeBetBtn/PlaceBetBtn";
import BetForm from "./bet_crud/BetForm";
import CreateEventForm from "../crud-forms/CreateEventForm";
import { Link } from "react-router-dom";
//crud
import useCrud from "../../../services/useCrud";
import { handleDeleteObject } from "./DeleteEvent";

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

export default function EventDetailsCard() {
  const [openBetForm, setBetFormOpen] = useState(false);

  //func to open and close the form
  const toggleBetForm = () => setBetFormOpen(!openBetForm);

  const { event, group, participants, userId, eventId, userIsEventCreator } =
    useEventData();

  const { deleteObject }  = useCrud();
  console.log("EventDetailCard Component event DATA TEST", event);
  console.log("EventDetailCard Component eventId DATA TEST", eventId);
  console.log("EventDetailCard Component eventId DATA TEST", event.group);
  console.log("EventDetailCard Component organizer DATA TEST", userIsEventCreator);
  console.log("EventDetailCard Component deleteObject DATA TEST", deleteObject);

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  return (
    <Card
      sx={{
        maxWidth: 300,
        maxHeight: 700,
        overflow: "auto",
        borderRadius: "20px",
        borderColor: "#000",
        background: "#EAE5E1",
        "@media (min-width: 768px)": {
          maxWidth: 400,
          maxHeight: "none",
        },
      }}
      elevation={1}
    >
      <CardHeader
        title={
          <Link
            to={`/group/${group.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Garamond, serif",
                fontSize: "1.3rem",
                fontWeight: "bold",
                ml: "2%",
                // textDecorationLine: "underline",
                // textDecorationColor: "#00DE49",
              }}
            >{`${group.name}`}</Typography>
          </Link>
        }
        action={
          <Box
            sx={{ pt: 1, pr: 1, pb: 1 }}
            display="flex"
            justifyContent="center"
            flexGrow={1}
          >
            <PlaceBetBtn toggleBetForm={toggleBetForm} />
            <BetForm open={openBetForm} onClose={toggleBetForm} />
          </Box>
        }
      />

      {/* Card Media: Displaying the banner image */}
      <CardMedia
        component="img"
        height="300"
        image={
          group.banner_img
            ? event.group.banner_img
            : "https://source.unsplash.com/random/?mountain"
        }
        alt="banner image"
      />

      {/* Card Content: Displaying event details */}
      <CardContent>
        <Box sx={{ margin: 2, backgroundColor: "#EAE5E1" }}>
          {/* Event Title */}
          <Typography
            // variant="h3"
            sx={{
              marginTop: 1,
              fontFamily: "Garamond, serif",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            {event.team1} Vs {event.team2}
          </Typography>

          {/* Event Time Display: Start and End Time */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              marginTop: 2,
            }}
          >
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              <EventTimeStamp
                createdAt={event.start_time}
                timezone="America/New_York"
              />
              <span style={{ marginLeft: "8px" }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    textDecorationLine: "underline",
                    textDecorationColor: "#00DE49",
                  }}
                >
                  Starts
                </Typography>
              </span>{" "}
              {/* Start time label */}
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
              <EventTimeStamp createdAt={event.end_time} timezone="America/New_York" />
              <span style={{ marginLeft: "8px" }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    textDecorationLine: "underline",
                    textDecorationColor: "#DE0000",
                  }}
                >
                  Ends
                </Typography>
              </span>{" "}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Card Actions: Share and Expand */}
      <CardActions disableSpacing>
        {userIsEventCreator && (
          <IconButton aria-label="share" onClick={() => handleDeleteObject(deleteObject, eventId, navigate)}>
            <DeleteSweepIcon />
          </IconButton>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      {/* Collapse Section: Additional Event Details */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph sx={{ fontFamily: "Georgia, serif" }}>
            Dive into the details of this thrilling event where {event.team1} faces off
            against {event.team2}. Experience the excitement, the anticipation, and the
            spirit of the game.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
