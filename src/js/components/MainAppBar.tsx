import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function MainAppBar(): JSX.Element {
  return (
    <AppBar position="static" style={{ zIndex: 1, position: 'relative' }}>
      <Toolbar>
        <Typography variant="h5">
          bananas for books
          { /* when changing the title above, also change it in index.html and 404.html */ }
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
