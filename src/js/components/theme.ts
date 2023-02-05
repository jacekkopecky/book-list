import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
  },
  palette: {
    primary: {
      main: '#4488ff',
      contrastText: 'white',
    },
    secondary: {
      main: '#cc3333',
    },
    text: {
      primary: '#000',
    },
  },
});

export default theme;
