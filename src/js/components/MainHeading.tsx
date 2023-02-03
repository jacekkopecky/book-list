import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Container, IconButton, Tab, Tabs, Toolbar,
} from '@material-ui/core';

import { ArrowBack } from '@material-ui/icons';

import { containerProps } from './theme';

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
    <Container {...containerProps}>
      <Toolbar disableGutters>{ tabs }</Toolbar>
      { children }
    </Container>
  );
}
