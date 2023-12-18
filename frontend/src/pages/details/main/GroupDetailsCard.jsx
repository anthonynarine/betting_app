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
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EventTimestamp from "./EventTimeStamp";
import { useGroupData } from "../../../context/groupData/GroupDataProvider";
import { JoinGroupBtn } from "./JoinGroupBtn";
import { LeaveGroupBtn } from "./LeaveGroupBtn";
import { Link } from "react-router-dom";
import CountDownTimer from "../../events/main/EventCountDownTimer";

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
  const { events, group, members, userId } = useGroupData();

  console.log("GroupDetailsCard DATA", group); //DEBUG TESTS
  // console.log("GroupDetailsCard Members:", members); //DEBUG TESTS
  // console.log("GroupDetailsCard User ID:", userId); //DEBUG TESTS

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const isMember = members
    ? members.some((member) => member?.user?.id === Number(userId))
    : false;

  return (
    <Card
      sx={{
        maxWidth: 300,
        maxHeight: 400,
        overflow: "auto",
        borderRadius: "20px",
        borderColor: "#000",
        background: "#fff",
        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.5)",
        "@media (min-width: 768px)": {
          maxWidth: 400,
          maxHeight: "none",
        },
      }}
      elevation={3}
    >
      <CardHeader
        action={
          <Box
            sx={{ pt: 1.25, pr: 1 }}
            display="flex"
            justifyContent="center"
            flexGrow={1}
          >
            {isMember ? (
              <IconButton aria-label="leave-group">
                <LeaveGroupBtn />
              </IconButton>
            ) : (
              <IconButton aria-label="join-group">
                <JoinGroupBtn />
              </IconButton>
            )}
          </Box>
        }
        title={
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              {group.name}
            </Typography>
          </Link>
        }
        subheader={
          <Typography variant="subtitle1" color="textSecondary">
            {group.description}
          </Typography>
        }
      />

      <CardMedia
        component="img"
        height="300"
        image={
          group.banner_img
            ? group.banner_img
            : "https://source.unsplash.com/random/?mountain"
        }
        alt="banner image"
      />

      <CardContent>
      <Box sx={{ margin: 2 }}>
  <Typography variant="h5" color="#000" style={{ fontWeight: "bold" }}>
    Events
  </Typography>
  {events && events.length > 0 && (
    events.map((event) => (
      <Box
        key={event.id}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
          margin: "10px 0",
          position: "relative", 
        }}
      >
        {/* Team names and 'vs' */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "8px",
          }}
        >
          <Box sx={{ flex: 1, textAlign: "center", overflow: "hidden" }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "600",
                fontFamily: "'Roboto', sans-serif",
                color: "black",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {event.team1}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontFamily: "'Roboto', sans-serif",
              color: "black",
              mx: 2, // margin for left and right
              textAlign: "center",
              minWidth: "40px", // Ensure some space for 'vs' text
            }}
          >
            vs
          </Typography>

          <Box sx={{ flex: 1, textAlign: "center", overflow: "hidden" }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "600",
                fontFamily: "'Roboto', sans-serif",
                color: "black",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {event.team2}
            </Typography>
          </Box>
        </Box>

        {/* Countdown Timer */}
        <Typography
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Roboto', sans-serif",
            color: "gray",
            fontSize: "0.9rem",
          }}
        >
          <CountDownTimer event={event} />
        </Typography>
      </Box>
    ))
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
          <Typography paragraph>Additional details can be added here.</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
