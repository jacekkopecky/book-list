import * as React from 'react';

import Fab from '@material-ui/core/Fab';
import Container from '@material-ui/core/Container';

import AddIcon from '@material-ui/icons/Add';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import SearchIcon from '@material-ui/icons/Search';

import './ActionButtons.css';

interface ActionButtonsProps {
  itemName: string,
  showingOwned: boolean,
  onSwitchOwned: (val: boolean) => void,
  addBook: () => void,
}

export default function ActionButtons(props: ActionButtonsProps): JSX.Element {
  const {
    itemName,
    showingOwned,
    onSwitchOwned,
    addBook,
  } = props;

  const switchText = showingOwned ? `Show ${itemName} I\u00a0want` : `Show ${itemName} I\u00a0have`;

  return (
    <div className="action-buttons">
      <Container maxWidth="sm">
        <Fab aria-label="search" color="primary" disabled><SearchIcon /></Fab>
        <Fab
          variant="extended"
          onClick={() => onSwitchOwned(!showingOwned)}
        >
          <ImportExportIcon />
          { switchText }
        </Fab>
        <Fab aria-label="add" color="primary" onClick={addBook}><AddIcon /></Fab>
      </Container>
    </div>
  );
}
