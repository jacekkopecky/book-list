import * as React from 'react';

import Container from '@material-ui/core/Container';

import './ActionButtons.css';

export default function ActionButtons({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="action-buttons">
      <Container maxWidth="sm">
        <>{ children }</>
      </Container>
    </div>
  );
}
