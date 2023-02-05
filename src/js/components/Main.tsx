import { Container } from '@mui/material';
import React from 'react';

interface MainProps {
  top?: JSX.Element,
  style?: React.CSSProperties,
}

export default function Main(props: React.PropsWithChildren<MainProps>) {
  return (
    <Container
      component="main"
      sx={(theme) => ({
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        '--bg': theme.palette.background.paper,
        backgroundColor: 'var(--bg)',
        ...props.style,
      })}
    >
      { props.top && (
        <div style={{
          backgroundColor: 'var(--bg)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
        >
          { props.top }
        </div>
      ) }
      { props.children }
    </Container>
  );
}
