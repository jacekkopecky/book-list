import * as React from 'react';
import { Link } from 'react-router-dom';

import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

import { Author, Book } from '../types';
import * as tools from '../tools/tools';

import ActionButtons from './ActionButtons';
import EmptyListItem from './EmptyListItem';
import MainTabs from './MainTabs';

export default function AuthorList({ books }: { books: Book[] }): JSX.Element {
  const [showingOwned, showingSwitchFab] = tools.useShowingOwned('authors');

  const authors = new Map<string, Author | undefined>();
  const selectedBooks = books.filter((b) => b.owned === showingOwned);
  for (const book of selectedBooks) {
    authors.set(tools.authorKey(book.author), book.author);
  }

  const sorted = Array.from(authors.keys()).sort();

  return (
    <MainTabs>
      <List>
        { sorted.length > 0 ? sorted.map((x) => renderAuthor(x)) : <EmptyListItem /> }
      </List>

      <ActionButtons>
        <Fab aria-label="search" color="primary"><SearchIcon /></Fab>
        { showingSwitchFab }
        <Fab aria-label="add" color="secondary"><AddIcon /></Fab>
      </ActionButtons>
    </MainTabs>
  );

  function renderAuthor(key: string) {
    const author = authors.get(key) ?? tools.UNKNOWN;
    const id = tools.authorPath(author);
    const link = `/author/${id}${showingOwned ? '?owned' : ''}`;
    return (
      <ListItem key={key} button divider component={Link} to={link}>
        <ListItemText>{ author.fname } { author.lname }</ListItemText>
      </ListItem>
    );
  }
}
