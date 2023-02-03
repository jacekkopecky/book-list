import * as React from 'react';

import { Fab, Container } from '@material-ui/core';
import { Add, ImportExport, Search } from '@material-ui/icons';

import './ActionButtons.css';

interface ActionButtonsProps {
  itemName: string,
  showingOwned: boolean,
  onSwitchOwned: (val: boolean) => void,
  addBook: () => void,
}

export default function ActionButtons(props: ActionButtonsProps): JSX.Element {
  const {
    itemName, showingOwned, onSwitchOwned, addBook,
  } = props;

  const switchText = showingOwned ? `Show ${itemName} I\u00a0want` : `Show ${itemName} I\u00a0have`;

  return (
    <div className="action-buttons">
      <Container maxWidth="sm">
        <Fab aria-label="search" color="primary" disabled>
          <Search />
        </Fab>
        <Fab variant="extended" onClick={() => onSwitchOwned(!showingOwned)}>
          <ImportExport />
          { switchText }
        </Fab>
        <Fab aria-label="add" color="primary" onClick={addBook}>
          <Add />
        </Fab>
      </Container>
    </div>
  );
}
