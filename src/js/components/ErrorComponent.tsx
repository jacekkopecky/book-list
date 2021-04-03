import * as React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import { containerProps } from './theme';

import './ErrorComponent.css';

export default function ErrorComponent({ text }: { text: string }): JSX.Element {
  return (
    <Container {...containerProps} className="ErrorComponent">
      <Typography>Error: { text }</Typography>
    </Container>
  );
}
