import { createTheme } from '@mui/material/styles';
import { deepPurple, deepOrange, indigo, } from '@mui/material/colors';



const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[900],

    },
    secondary: {
      main: deepPurple[400],
    },
  },
});

export default theme;
  