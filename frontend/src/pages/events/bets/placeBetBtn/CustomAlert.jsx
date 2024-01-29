import React from "react";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

const CustomAlert = ({ message, severity }) => {
    const theme = useTheme();

    // Custom styling for error alerts
    const errorStyle = {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.error.contrastText,
        border: `3px solid #ED2939`,
        fontSize: "17px",  // Custom font size
        // fontWeight: "bold",  // Custom font weight
        textAlign: "center",  // Center align text
        fontFamily: "Teko",

    };

    // Apply the custom style if the severity is is "error"
    const alertStyle = severity === "error" ? errorStyle : {};

    return(
        <Alert
            severity={severity}
            style={{
                ...alertStyle,
                ...theme.components.MuiAlert.styleOverrides.root  // Appliy glogal overrides
            }}
        >
            {message}
        </Alert>
    );
};

export default CustomAlert