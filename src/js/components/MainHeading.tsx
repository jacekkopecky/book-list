import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import MainAppBar from './MainAppBar';

import * as tools from '../tools/tools';
import { containerProps } from './theme';

interface MainTabsProps {
  title: string,
  children?: React.ReactNode,
}

export default function MainHeading({ title, children }: MainTabsProps): JSX.Element {
  const narrow = tools.isNarrow();

  const tabs = (
    <Tabs value="1" variant="fullWidth" indicatorColor="primary">
      <Tab value="1" label={title} />
    </Tabs>
  );

  if (narrow) {
    return (
      <>
        <AppBar position="relative">
          <Toolbar>
            { tabs }
          </Toolbar>
        </AppBar>
        <Container {...containerProps}>
          <>
            { children }
          </>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <MainAppBar />
        <Container {...containerProps}>
          { tabs }
          { children }
        </Container>
      </>
    );
  }
}
