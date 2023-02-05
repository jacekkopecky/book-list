import * as React from 'react';

import { ListItem, ListItemText } from '@mui/material';

export default function EmptyListItem({ text = 'empty' }: { text?: string }): JSX.Element {
  return (
    <ListItem divider style={{ fontStyle: 'italic', opacity: 0.5 }}>
      <ListItemText>{ text }</ListItemText>
    </ListItem>
  );
}
