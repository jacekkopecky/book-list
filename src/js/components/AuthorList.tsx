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

export default function AuthorList({ books }: { books: Book[] }): JSX.Element {
  const query = tools.useQuery();
  const history = useHistory();
  const showingOwned = query.has('owned');

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
        { sorted.map((x) => renderAuthor(x)) }
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
    return (
      <AuthorItem
        key={key}
        id={tools.authorPath(author)}
        author={author}
        showOwned={showingOwned}
      />
    );
  }
}

interface AuthorItemProps {
  id: string,
  author: Author,
  showOwned: boolean,
}

function AuthorItem({ id, author, showOwned } : AuthorItemProps): JSX.Element {
  const link = `/author/${id}${showOwned ? '?owned' : ''}`;
  return (
    <ListItem button divider component={Link} to={link}>
      <ListItemText>{ author.fname } { author.lname }</ListItemText>
    </ListItem>
  );
}
