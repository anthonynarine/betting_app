import React, { useState, useEffect } from "react";
import { Typography, Box, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Time icon

const CountDownTimer = ({ event }) => {
    // State for storing time left until the event starts/ends
    const [timeLeft, setTimeLeft] = useState({});

    // State for storing the current status of the event
    const [status, setStatus] = useState("Upcoming");

    //Function to calc. time left and update the status
    const calculateTimeLeft = () => {
        // Currnt date and time
        let now = new Date();

        // Convert event start & end times from string to Date objs.
        let startTime = new Date(event.start_time);
        let endTime = new Date(event.end_time);

        // Check if the current time is before the event start time
        if (now < startTime) {
            // Calc the diff in time between now & event start
            let difference = startTime - now;
            setStatus("Starts in")
            return {
                // Calculate hours left
                   /* 
                    Explanation:
                    - `difference` is the time difference in milliseconds.
                    - `1000 * 60 * 60` converts milliseconds to hours.
                    - `Math.floor` rounds down to the nearest whole number.
                    - `% 24` ensures the hour count resets every 24 hours.
                    */
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                // Calculate minutes left
                minutes: Math.floor((difference / 1000 / 60) % 60),
                    /* 
                    Explanation:
                    - `difference` is the time difference in milliseconds.
                    - `1000 * 60` converts milliseconds to minutes.
                    - `Math.floor` rounds down to the nearest whole number.
                    - `% 60` ensures the minute count resets every 60 minutes.
                    */
                // Calculate seconds left
                seconds: Math.floor((difference / 1000) % 60),
                /* 
                    Explanation:
                    - `difference` is the time difference in milliseconds.
                    - `1000` converts milliseconds to seconds.
                    - `Math.floor` rounds down to the nearest whole number.
                    - `% 60` ensures the second count resets every 60 seconds.
                */
            };
        } 
        // Check if current time is between now and event end
        else if (now >= startTime && now <= endTime){
            const difference = endTime - now;
            setStatus("In Progress");
            return {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        // if current time is after the event end time
        else {
            setStatus("Ended");
            return {}
        }
    };

    useEffect(()=>{
        // Immediately update the time left when the component or event times change
        setTimeLeft(calculateTimeLeft());

        // Set up an interval taht update the countdown ever second
        let timer = setInterval(()=>{
            // Update the time left using the calculateTimeLeft function
            setTimeLeft(calculateTimeLeft());
        },1000) // 1000 milliseconds = 1 sec

// Cleanup function to clear the interval when the component unmounts or depencies change
// This prevents memort leaks and enusres the times is accurate
        return () => clearInterval(timer)

    },[event.start_time, event.end_time])

    return(
        <>
             <Box sx={{ 
                minWidth: "14px",
                maxWidth: "17rem",
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                padding: '6px 10px', 
                borderRadius: '16px', 
                backgroundColor: '#000',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                marginTop: "10px"
            }}>
                {/* Display the status of the event with an icon */}
                <Chip 
                    icon={<AccessTimeIcon />} 
                    label={status} 
                    size="medium" 
                    sx={{ 
                        fontWeight: 'bold', 
                        color: '#424242', 
                        backgroundColor: '#000'
                    }}
                />

                {/* Display the time left in a sleek style with fixed width */}
                <Typography variant="caption" sx={{ color: '#00DE49', fontWeight: "bold", minWidth: '75px' }}>
                    {`${timeLeft.hours ? `${timeLeft.hours}h ` : '00h '} 
                    ${timeLeft.minutes ? `${timeLeft.minutes}m ` : '00m '} 
                    ${timeLeft.seconds ? `${timeLeft.seconds}s` : '00s'}`}
                </Typography>
            </Box>
        </>
    )

};
export default CountDownTimer;