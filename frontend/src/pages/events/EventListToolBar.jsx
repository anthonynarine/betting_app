import { Box, Toolbar, Typography} from "@mui/material";
import { useUserServices } from "../../context/user/UserContext";



const EventListToolBar = () => {
    const { userData } = useUserServices

    return(
        <>
            <Toolbar >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="right"
                    width="100%"
                >
                <Typography variant='h6'>Created Events</Typography>
                </Box>
            </Toolbar>
        </>
    )

};
export default EventListToolBar;