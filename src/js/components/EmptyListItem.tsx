import * as React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import './EmptyListItem.css';

export default function EmptyListItem(): JSX.Element {
  return (
    <ListItem divider className="EmptyListItem">
      <ListItemText className="empty">empty</ListItemText>
    </ListItem>
  );
}
