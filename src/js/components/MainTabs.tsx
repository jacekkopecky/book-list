import * as React from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import MainAppBar from './MainAppBar';

import * as tools from '../tools/tools';
import theme, { containerProps } from './theme';

interface MainTabsProps {
  children?: React.ReactNode,
}

export default function MainTabs({ children }: MainTabsProps): JSX.Element {
  const location = useLocation();
  const query = tools.useQuery();
  const ownedPostfix = query.has('owned') ? 'I have' : 'I want';

  const narrow = useMediaQuery(theme.breakpoints.down('xs'));

  const tabs = [
    <Tab
      key={0}
      component={Link}
      value="/"
      label={`Authors ${ownedPostfix}`}
      to={`/${location.search}`}
    />,
    <Tab
      key={1}
      component={Link}
      value="/series"
      label={`Series ${ownedPostfix}`}
      to={`/series${location.search}`}
    />,
  ];

  if (narrow) {
    return (
      <>
        <AppBar position="relative">
          <Toolbar>
            <Tabs value={location.pathname}>
              { tabs }
            </Tabs>
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
          <Tabs value={location.pathname} indicatorColor="primary">
            { tabs }
          </Tabs>
          { children }
        </Container>
      </>
    );
  }
}
