import { Box } from "@mui/material";

export function LogoIcon() {
    return (
        <Box
            component="img"
            sx={{
                height: 35,
                width: 35,
                marginLeft: .5
                // maxHeight: { xs: 233, md: 167 },
                // maxWidth: { xs: 350, md: 250 },
            }}
            alt="Bet on This Icon"
            src="/dice.svg"
        />
    );
}
