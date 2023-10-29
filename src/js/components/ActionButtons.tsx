import * as React from 'react';

import { Fab, Stack } from '@mui/material';
import { Add, ImportExport, Search } from '@mui/icons-material';

interface ActionButtonsProps {
  itemName: string,
  showingOwned: boolean,
  onSwitchOwned: (val: boolean) => void,
  addBook?: () => void,
}

export default function ActionButtons(props: ActionButtonsProps): JSX.Element {
  const {
    itemName, showingOwned, onSwitchOwned, addBook,
  } = props;

  const switchText = showingOwned ? `Show ${itemName} I\u00a0want` : `Show ${itemName} I\u00a0have`;

  return (
    <Stack
      direction="column-reverse"
      flexGrow={1}
      style={{
        position: 'sticky',
        bottom: '24px',
        left: 0,
        right: 0,
        marginTop: '24px',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        sx={{
          '& .MuiFab-root': {
            lineHeight: 1.2, // useful when the button is narrow and text wraps
          },
        }}
      >
        <Fab aria-label="search" color="primary" disabled>
          <Search />
        </Fab>
        <Fab variant="extended" onClick={() => onSwitchOwned(!showingOwned)}>
          <ImportExport />
          { switchText }
        </Fab>
        <Fab aria-label="add" color="primary" onClick={addBook} disabled={addBook == null}>
          <Add />
        </Fab>
      </Stack>
    </Stack>
  );
}
