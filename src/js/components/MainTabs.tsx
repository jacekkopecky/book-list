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

import MainAppBar from './MainAppBar';

import * as tools from '../tools/tools';
import { containerProps } from './theme';

import './MainTabs.css';

interface MainTabsProps {
  children?: React.ReactNode,
}

export default function MainTabs({ children }: MainTabsProps): JSX.Element {
  const location = useLocation();
  const query = tools.useQuery();
  const ownedPostfix = query.has('owned') ? 'I have' : 'I want';

  const narrow = tools.isNarrow();

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
        <AppBar position="sticky">
          <Toolbar>
            <Tabs value={location.pathname} variant="fullWidth" className="MainTabs">
              { tabs }
            </Tabs>
          </Toolbar>
        </AppBar>
        <Container {...containerProps} className="narrow">
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
