import * as React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import useCrud from "../../../../services/useCrud";
// import RateMovieDialog from "../RateMoive";

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

export default function GroupDetailsCard({ apiData  }) {
  const { name, location, banner_img, description, events } = apiData;

  const [expanded, setExpanded] = useState(false);


  console.log("test in groudDetailsCard", apiData)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const navigate = useNavigate();
  const { deleteData } = useCrud([], "/groups");

  const handleDelete = async (id) => {
    try {
      await deleteData(apiData.id);
      console.log(apiData.id, apiData.title, "DELETED");
      navigate("/");
      // Maybe show a success message after deletion
    } catch (error) {
      console.error("Failed to delete:", error);
      // Handle error (maybe show an error message to the user)
    }
  };

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
        // Shadow to simulate pages
        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)",
        // Light background color like pages of a book
        background: "#f2f2f2",
        // CSS media query for larger screens
        "@media (min-width: 768px)": {
          // Adjust maxWidth for wider screens
          maxWidth: 700, // You can adjust this value
          // Remove maxHeight for wider screens (no scrolling)
          maxHeight: "none",
        },
      }}
      elevation={0}
    >
      <CardHeader
        avatar={<Avatar src={"https://source.unsplash.com/random/?plant"} aria-label="movie-icon" />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={<Typography variant="h5">{name}</Typography>}
        subheader={
          
          <Typography variant="h6">
            Location: {location} 
          </Typography>
        }
      />
      <CardMedia
        component="img"
        height="300"
        image={banner_img ? banner_img : "https://source.unsplash.com/random/?football"}
        alt="banner image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {events && events.length > 0 && (
          <>
            <Typography variant="h6">Event:</Typography>
            {events.map((event) => (
              <div key={event.id}>
                <Typography variant="body2">{event.team1} Vs {event.team2}</Typography>
                <Typography variant="body2">Time: {event.time}</Typography>
                {/* Add more event details here */}
              </div>
            ))}
          </>
        )}
        
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton onClick={handleOpenRateMovie}><Button variant="contained" >Rate Movie</Button></IconButton>
        <RateMovieDialog
          group={apiData}
          open={isRateMovieOpen}
          handleClose={handleCloseRateMovie}
        /> */}
        <IconButton aria-label="share">
          <DeleteSweepIcon onClick={handleDelete} />
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
          <Typography paragraph>Additional details can be added here.</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

