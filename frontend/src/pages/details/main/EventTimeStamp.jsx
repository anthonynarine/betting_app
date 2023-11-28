import React from "react";
import Moment from "react-moment";
import "moment-timezone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function EventTimestamp({
  createdAt,
  showDate = true,
  timezone = "America/New_York", // defaults to east coast tz 
}) {
  return (
    <>
      {showDate && (
        <>
          <CalendarMonthIcon sx={{ marginRight: "4px" }} />
          <Moment format="MM/DD/YYYY" tz={timezone}>{createdAt}</Moment>
        </>
      )}
      <AccessTimeIcon sx={{ marginLeft: showDate ? 1.5 : 0, marginRight: "4px" }} />
      <Moment format="hh:mm A" tz={timezone}>{createdAt}</Moment>
    </>
  );
}



// eslint-disable-next-line no-lone-blocks
{
  /*
  <div>
    <EventTimestamp createdAt={createdAt} />
    <EventTimestamp createdAt={createdAt} timezone="America/New_York" />
    <EventTimestamp createdAt={createdAt} showDate={false} />
    <EventTimestamp createdAt={createdAt} showDate={false} timezone="America/New_York" />
  </div>
  */
}
