import * as React from 'react';

import { Typography } from '@mui/material';

import Main from './Main';

export default function ErrorComponent({ text }: { text: string }): JSX.Element {
  return (
    <Main style={{ paddingTop: '1em' }}>
      <Typography>Error: { text }</Typography>
    </Main>
  );
}
