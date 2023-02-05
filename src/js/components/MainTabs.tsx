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

  const separator = <div style={{ alignSelf: 'center', margin: '0.25em' }}>/</div>;

  return (
    <Main top={(
      <Tabs
        value={location.pathname}
        indicatorColor="primary"
        sx={(theme) => ({ '& .MuiTab-root.Mui-selected': { color: theme.palette.text.primary } })}
      >
        <Tab
          component={Link}
          value="/"
          label={`Authors ${ownedPostfix}`}
          to={`/${location.search}`}
        />
        { separator }
        <Tab
          component={Link}
          value="/series"
          label="Series"
          to={`/series${location.search}`}
        />
        { separator }
        <Tab
          component={Link}
          value="/singles"
          label="Singles"
          to={`/singles${location.search}`}
        />
      </Tabs>
    )}
    >
      { children }
    </Main>
  );
}
