import React from "react";
import { Alert } from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

const CustomAlert = ({ message, severity }) => {
    const theme = useTheme();

    return(
        <Alert
            severity={severity}
            style={{
                backgroundColor: theme.components?.MuiAlert?.styleOverrides?.root?.backgroundColor,
                color: theme.components?.MuiAlert?.styleOverrides?.root?.color,

              }}
        >
            {message}
        </Alert>
    );
};

export default CustomAlert