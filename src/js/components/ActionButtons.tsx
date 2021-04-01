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
}

export default function ActionButtons(props: ActionButtonsProps): JSX.Element {
  const { itemName, showingOwned, onSwitchOwned } = props;

  const switchText = showingOwned ? `Show ${itemName} I want` : `Show ${itemName} I have`;

  return (
    <div className="action-buttons">
      <Container maxWidth="sm">
        <Fab aria-label="search" color="primary"><SearchIcon /></Fab>
        <Fab
          variant="extended"
          onClick={() => onSwitchOwned(!showingOwned)}
        >
          <ImportExportIcon />
          { switchText }
        </Fab>
        <Fab aria-label="add" color="secondary"><AddIcon /></Fab>
      </Container>
    </div>
  );
}
