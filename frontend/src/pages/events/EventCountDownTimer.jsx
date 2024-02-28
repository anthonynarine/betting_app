import React, { useState, useEffect } from "react";
import { Typography, Box, Chip, IconButton, useTheme, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CompleteEventForm from "./forms/CompleteEventForm";


/**
 * A countdown timer component that displays the time remaining until an event starts or ends.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.event - Event object containing start and end times.
 * @returns React component.
 */
const CountDownTimer = ({ event }) => {

    const theme = useTheme(); 
    // State to store the remaining time until the event.
    const [timeLeft, setTimeLeft] = useState({});

    // State to manage modal visibility
    const [modalOpen, setModalOpen] = useState(false);
    // switch to toggle state of modal
    const toggleModal = () => setModalOpen(!modalOpen);

    // State to store the current status of the event (Upcoming, Starts in, In Progress, Ended).
    const [status, setStatus] = useState("Upcoming");

    /**
     * Calculates the time left until the event starts or ends.
     * 
     * @returns {Object} An object containing the time left in years, months, weeks, days, hours, minutes, and seconds.
     */
    const calculateTimeLeft = () => {
        let now = new Date();
        let targetTime = new Date(now < new Date(event.start_time) ? event.start_time : event.end_time);

        // Check if the current time is before the target time.
        if (now < targetTime) {
            // Update the status based on whether the event is upcoming or in progress.
            setStatus(now < new Date(event.start_time) ? "Starts in" : "In Progress");
            let difference = targetTime - now;
            let timeLeft = {};

            // Calculate and store the time components.
            timeLeft.years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
            difference -= timeLeft.years * 1000 * 60 * 60 * 24 * 365;
            timeLeft.months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
            difference -= timeLeft.months * 1000 * 60 * 60 * 24 * 30;
            timeLeft.weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
            difference -= timeLeft.weeks * 1000 * 60 * 60 * 24 * 7;
            timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24));
            difference -= timeLeft.days * 1000 * 60 * 60 * 24;
            timeLeft.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            timeLeft.minutes = Math.floor((difference / 1000 / 60) % 60);
            timeLeft.seconds = Math.floor((difference / 1000) % 60);

            return timeLeft;
        } else {
            // If the current time is past the target time, set the status to "Ended".
            setStatus("Ended");
            return {};
        }
    };

    // Effect hook to set up a timer that updates the remaining time every second.
    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        let timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [event.start_time, event.end_time]);

    /**
     * Renders the time left components.
     * 
     * @returns {Array} An array of JSX elements representing the time left components.
     */
    const renderTimeLeft = () => {
        if (status === "Ended") {
            return null; // Do not display time units if the event has ended.
        }
    
        let components = [];
        // Add each time component to the array if its value is greater than 0.
        if (timeLeft.years > 0) {
            components.push(<span key="years">{`${timeLeft.years}y `}</span>);
        }
        if (timeLeft.months > 0) {
            components.push(<span key="months">{`${timeLeft.months}mo `}</span>);
        }
        if (timeLeft.weeks > 0) {
            components.push(<span key="weeks">{`${timeLeft.weeks}w `}</span>);
        }
        if (timeLeft.days > 0) {
            components.push(<span key="days">{`${timeLeft.days}d `}</span>);
        }
        if (timeLeft.hours > 0) {
            components.push(<span key="hours">{`${timeLeft.hours}h `}</span>);
        }
        if (timeLeft.minutes > 0) {
            components.push(<span key="minutes">{`${timeLeft.minutes}m `}</span>);
        }
        if (timeLeft.seconds > 0) {
            components.push(<span key="seconds">{`${timeLeft.seconds}s`}</span>);
        }
    
        return components;
    };

    return (
        <>
            <Box sx={{ 
                maxWidth: "16rem",
                minHeight: "3rem",
                maxHeight: "3rem",
                display: 'flex', 
                alignItems: 'center', 
                gap: 4, 
                padding: '6px 10px', 
                borderRadius: '16px', 
                backgroundColor: theme.palette.primary.dark,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                marginTop: "1px"
            }}>
                <Chip 
                    // icon={<AccessTimeIcon />} 
                    label={status} 
                    size="small" 
                    sx={{ 
                        fontWeight: 'bold', 
                        color: theme.palette.secondary.main, 
                        backgroundColor: theme.palette.primary.dark,
                        display: 'flex',
                        width: {
                            xs: '5rem', 
                            sm: '6rem', 
                        }
                    }}
                />
                <Typography component="span" variant="caption" sx={{ color: '#00DE49', fontWeight: "bold", minWidth: '75px' }}>
                    {renderTimeLeft()}
                </Typography>
                {status === "Ended" && (
                    <IconButton onClick={toggleModal}>
                            <Tooltip sx={{color: theme.palette.primary.contrastText}} title="Complete Event" placement="left">
                                <CheckCircleIcon sx={{ color: theme.palette.secondary.contrastText,  }} />
                            </Tooltip>
                    </IconButton>
                )}

                <CompleteEventForm
                    modalOpen={modalOpen}
                    toggleModal={toggleModal}
                    // onEventComplete={onEventComplete}
                    teams={[event.team1, event.team2]}
                />
            </Box>
        </>
    );
};

export default CountDownTimer;
