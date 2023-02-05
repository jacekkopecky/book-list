import * as React from 'react';
import { Link } from 'react-router-dom';

import { List, ListItemButton, ListItemText } from '@mui/material';

import { Book, AddBookTrigger } from '../types';
import * as tools from '../tools/tools';

import ActionButtons from './ActionButtons';
import EmptyListItem from './EmptyListItem';
import MainTabs from './MainTabs';

interface TitleListProps {
  books: Book[],
  addBookTrigger: AddBookTrigger,
  singlesOnly?: boolean,
}

export default function TitleList({
  books, addBookTrigger, singlesOnly,
}: TitleListProps): JSX.Element {
  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const titles = new Set<string>();

  const selectedBooks = books.filter(
    (b) => (b.owned === showingOwned) && (!singlesOnly || !b.series),
  );

  for (const book of selectedBooks) {
    if (book.title) titles.add(book.title);
  }

  const sorted = Array.from(titles).sort(tools.localeCompare);

  return (
    <MainTabs>
      <List>
        { sorted.length > 0 ? sorted.map(renderTitle) : <EmptyListItem text="no titles" /> }
      </List>

      <ActionButtons
        itemName="titles"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
        addBook={() => addBookTrigger({ owned: showingOwned })}
      />
    </MainTabs>
  );

  function renderTitle(title: string) {
    const id = tools.valuePath(title);
    const link = `/title/${id}${showingOwned ? '?owned' : ''}`;
    return (
      <ListItemButton key={title} divider component={Link} to={link}>
        <ListItemText>{ title }</ListItemText>
      </ListItemButton>
    );
  }
}
