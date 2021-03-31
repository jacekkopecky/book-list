import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4488ff',
      contrastColor: 'white',
    },
    secondary: {
      main: '#66ff88',
    },
    text: {
      primary: 'black',
    },
  },
});

export default theme;
