import * as React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import './EmptyListItem.css';

export default function EmptyListItem({ text = 'empty' }: { text?: string }): JSX.Element {
  return (
    <ListItem divider className="EmptyListItem">
      <ListItemText className="empty">{ text }</ListItemText>
    </ListItem>
  );
}
