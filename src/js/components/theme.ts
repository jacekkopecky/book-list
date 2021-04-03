import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4488ff',
      contrastText: 'white',
    },
    secondary: {
      main: '#66ff88',
    },
    text: {
      primary: '#000',
    },
  },
});

export default theme;

export const containerProps = {
  component: 'main' as const,
  maxWidth: 'sm' as const,
  style: {
    backgroundColor: theme.palette.background.paper,
  },
};
