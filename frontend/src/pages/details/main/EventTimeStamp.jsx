import React from 'react';
import Moment from 'react-moment';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Replace with your desired icon
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


export default function EventTimestamp({ createdAt }) {
  return (
    <>
      <CalendarMonthIcon sx={{ marginRight: "4px" }} />
      <Moment format="MM/DD/YYYY" />
      <AccessTimeIcon sx={{marginLeft:1.5, marginRight: "4px"}} /> 
      <Moment format="hh:mm A">{createdAt}</Moment> {/* A for AM/PM */}
    </>
  );
}