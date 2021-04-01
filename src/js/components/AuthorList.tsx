import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';

import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import AddIcon from '@material-ui/icons/Add';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import SearchIcon from '@material-ui/icons/Search';

import { Author, Book } from '../types';
import * as tools from '../tools/tools';
import ActionButtons from './ActionButtons';
import EmptyListItem from './EmptyListItem';

export default function AuthorList({ books }: { books: Book[] }): JSX.Element {
  const history = useHistory();

  const showingOwned = tools.useQuery().has('owned');

  const authors = new Map<string, Author | undefined>();
  const selectedBooks = books.filter((b) => b.owned === showingOwned);
  for (const book of selectedBooks) {
    authors.set(tools.authorKey(book.author), book.author);
  }

  const sorted = Array.from(authors.keys()).sort();

  const switchButton = showingOwned ? 'Show authors I want' : 'Show authors I have';

  return (
    <>
      <List>
        { sorted.length > 0 ? sorted.map((x) => renderAuthor(x)) : <EmptyListItem /> }
      </List>

      <ActionButtons>
        <Fab aria-label="search" color="primary"><SearchIcon /></Fab>
        <Fab
          variant="extended"
          onClick={() => history.replace(showingOwned ? '?' : '?owned')}
        >
          <ImportExportIcon />
          { switchButton }
        </Fab>
        <Fab aria-label="add" color="secondary"><AddIcon /></Fab>
      </ActionButtons>
    </>
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
