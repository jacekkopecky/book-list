import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export default function MainAppBar(): JSX.Element {
  return (
    <AppBar position="static" style={{ zIndex: 1, position: 'relative' }}>
      <Toolbar><h1>bananas for books</h1></Toolbar>
      { /* when changing the title above, also change it in index.html and 404.html */ }
    </AppBar>
  );
}
