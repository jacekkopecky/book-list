import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Container, Tab, Tabs } from '@material-ui/core';

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

  return (
    <Container {...containerProps}>
      <Tabs value={location.pathname} indicatorColor="primary">
        { tabs }
      </Tabs>
      { children }
    </Container>
  );
}
