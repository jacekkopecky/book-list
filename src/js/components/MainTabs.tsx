import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Tab, Tabs } from '@mui/material';

import * as tools from '../tools/tools';
import Main from './Main';

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
    <Main top={(
      <Tabs
        value={location.pathname}
        indicatorColor="primary"
        sx={(theme) => ({ '& .MuiTab-root.Mui-selected': { color: theme.palette.text.primary } })}
      >
        { tabs }
      </Tabs>
    )}
    >
      { children }
    </Main>
  );
}
