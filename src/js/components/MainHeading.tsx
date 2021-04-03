import * as React from 'react';
import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';

import BackIcon from '@material-ui/icons/ArrowBack';

import { containerProps } from './theme';

interface MainTabsProps {
  title: string,
  children?: React.ReactNode,
}

export default function MainHeading({ title, children }: MainTabsProps): JSX.Element {
  const history = useHistory();

  const tabs = (
    <>
      <IconButton color="inherit" onClick={() => history.goBack()}><BackIcon /></IconButton>
      <Tabs value="1" variant="fullWidth" indicatorColor="primary">
        <Tab value="1" label={title} />
      </Tabs>
    </>
  );

  return (
    <Container {...containerProps}>
      <Toolbar disableGutters>
        { tabs }
      </Toolbar>
      { children }
    </Container>
  );
}
