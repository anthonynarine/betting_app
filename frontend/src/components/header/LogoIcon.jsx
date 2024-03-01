import { Box } from "@mui/material";
import WagerWorldIcon from "../../asset/WagerWorldIcon.png";

export function LogoIcon() {
    return (
        <Box
            component="img"
            sx={{
                height: 75,
                width: 75,
                marginLeft: .5,
                marginRight: .25,
                // maxHeight: { xs: 233, md: 167 },
                // maxWidth: { xs: 350, md: 250 },
            }}
            alt="WagerWorld icon"
            src={WagerWorldIcon}
        />
    );
}

export default LogoIcon;
