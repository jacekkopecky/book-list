import * as React from 'react';
import { Link } from 'react-router-dom';

import { List, ListItemButton, ListItemText } from '@mui/material';

import { Author, Book, AddBookTrigger } from '../types';
import * as tools from '../tools/tools';

import ActionButtons from './ActionButtons';
import EmptyListItem from './EmptyListItem';
import MainTabs from './MainTabs';

interface AuthorListProps {
  books: Book[],
  addBookTrigger: AddBookTrigger,
  readOnly?: boolean,
}

export default function AuthorList(props: AuthorListProps): JSX.Element {
  const { books, addBookTrigger, readOnly } = props;
  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const authors = new Map<string | null, Author | undefined>();

  const selectedBooks = books.filter((b) => b.owned === showingOwned);
  for (const book of selectedBooks) {
    authors.set(tools.authorKey(book.author), book.author);
  }

  const sorted = Array.from(authors.keys()).sort(tools.localeCompare);

  return (
    <MainTabs>
      <List>
        { sorted.length > 0 ? sorted.map(renderAuthor) : <EmptyListItem text="no authors" /> }
      </List>

      <ActionButtons
        itemName="authors"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
        addBook={readOnly ? undefined : () => addBookTrigger({ owned: showingOwned })}
      />
    </MainTabs>
  );

  function renderAuthor(key: string | null) {
    const author = authors.get(key) ?? tools.UNKNOWN;
    const id = tools.authorPath(author);
    const link = `/author/${id}${showingOwned ? '?owned' : ''}`;
    return (
      <ListItemButton key={key} divider component={Link} to={link}>
        <ListItemText>{ author.fname } { author.lname }</ListItemText>
      </ListItemButton>
    );
  }
}
