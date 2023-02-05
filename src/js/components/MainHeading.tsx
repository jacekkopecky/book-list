import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  IconButton, Tab, Tabs, Toolbar,
} from '@mui/material';

import { ArrowBack } from '@mui/icons-material';
import Main from './Main';

interface MainTabsProps {
  title: string,
  children?: React.ReactNode,
}

export default function MainHeading({ title, children }: MainTabsProps): JSX.Element {
  const navigate = useNavigate();

  const tabs = (
    <>
      <IconButton color="inherit" onClick={() => navigate(-1)}>
        <ArrowBack />
      </IconButton>
      <Tabs value="1" variant="fullWidth" indicatorColor="primary">
        <Tab value="1" label={title} />
      </Tabs>
    </>
  );

  return (
    <Main top={(
      <Toolbar
        disableGutters
        sx={(theme) => ({ '& .MuiTab-root.Mui-selected': { color: theme.palette.text.primary } })}
      >{ tabs }
      </Toolbar>
    )}
    >
      { children }
    </Main>
  );
}
