import { createTheme } from '@mui/material/styles';
import { deepPurple, deepOrange, indigo } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],

    },
    secondary: {
      main: deepPurple[700],
    },
  },
});

export default theme;
  