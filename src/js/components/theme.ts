import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
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

export const containerProps = {
  component: 'main' as const,
  style: {
    '--bg': theme.palette.background.paper,
  } as React.CSSProperties,
};
