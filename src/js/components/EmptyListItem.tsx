import * as React from 'react';

import { ListItem, ListItemText } from '@material-ui/core';

import './EmptyListItem.css';

export default function EmptyListItem({ text = 'empty' }: { text?: string }): JSX.Element {
  return (
    <ListItem divider className="EmptyListItem">
      <ListItemText className="empty">{ text }</ListItemText>
    </ListItem>
  );
}
