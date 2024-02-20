import React, { useState } from "react";

// mui components
import { Box, useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useEventData } from "../../../context/eventData/EventDataProvider";
import CountDownTimer from "./EventCountDownTimer";
import EventTimeStamp from "../../group/main/EventTimeStamp"

// Styles
import { EventDetailCardStyles } from "./EventDetailCardStyles";

//icons
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

//bet
import { PlaceBetBtn } from "../bets/placeBetBtn/PlaceBetBtn";
import BetForm from "../bets/BetForm";
import BetDetailsCard from "../bets/BetDetailsCard";

import { Link, useNavigate } from "react-router-dom";


//crud
import useCrud from "../../../services/useCrud";
import { handleDeleteObject } from "../forms/DeleteEvent";
import UpdateEventForm from "../forms/UpdateEventForm";

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
  const [openUpdateEventForm, setUpdateFormOpen] = useState(false);

  //func to open and close the forms
  const toggleBetForm = () => setBetFormOpen(!openBetForm);
  const toggleEventForm = () => setUpdateFormOpen(!openUpdateEventForm);

  const { event, group, eventId, userIsEventCreator } = useEventData();

  const { deleteObject } = useCrud();
  console.log("EventDetailCard Component event DATA TEST", event);
  // console.log("EventDetailCard Component eventId DATA TEST", eventId);
  // console.log("EventDetailCard Component eventId DATA TEST", event.group);
  // console.log("EventDetailCard Component organizer DATA TEST", userIsEventCreator);
  // console.log("EventDetailCard Component deleteObject DATA TEST", deleteObject);

  const navigate = useNavigate();
  const theme = useTheme();
  const classes = EventDetailCardStyles(theme);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={classes.card}
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
            test
            <PlaceBetBtn toggleBetForm={toggleBetForm} />
            <BetForm open={openBetForm} onClose={toggleBetForm} />
          </Box>
        }
      />

      {/* Card Media: Displaying the banner image */}
      {/* <CardMedia
        component="img"
        height="300"
        image={
          group.banner_img
            ? event.group.banner_img
            : "https://source.unsplash.com/random/?mountain"
        }
        alt="banner image"
      /> */}

      {/* Card Content: Displaying event details */}
      <CardContent>
        <Box
          sx={classes.cardContentBox}
        >
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
              marginBottom: 2,
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
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: 1,
                marginBottom: 2,
              }}
            >
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
            <CountDownTimer event={event} />
            <BetDetailsCard />
          </Box>
        </Box>
      </CardContent>

      {/* Card Actions: Share and Expand */}
      <CardActions disableSpacing>
        {userIsEventCreator && (
          <IconButton
            aria-label="delete"
            onClick={() => handleDeleteObject(deleteObject, eventId, navigate)}
          >
            <DeleteSweepIcon />
          </IconButton>
        )}
        {userIsEventCreator && (
          <IconButton aria-label="update" onClick={toggleEventForm}>
            <EditIcon />
          </IconButton>
        )}
        {openUpdateEventForm && (
          <UpdateEventForm
            openUpdateEventForm={openUpdateEventForm}
            toggleEventForm={toggleEventForm}
          />
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
