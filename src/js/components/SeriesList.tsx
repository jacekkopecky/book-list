import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';

import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import AddIcon from '@material-ui/icons/Add';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import SearchIcon from '@material-ui/icons/Search';

import { Book } from '../types';
import * as tools from '../tools/tools';
import ActionButtons from './ActionButtons';
import EmptyListItem from './EmptyListItem';

export default function SeriesList({ books }: { books: Book[] }): JSX.Element {
  const query = tools.useQuery();
  const history = useHistory();
  const showingOwned = query.has('owned');

  const series = new Set<string>();

  const selectedBooks = books.filter((b) => b.owned === showingOwned);
  for (const book of selectedBooks) {
    if (book.series) series.add(book.series);
  }

  const sorted = Array.from(series).sort();

  const switchButton = showingOwned ? 'Show series I want' : 'Show series I have';

  return (
    <>
      <List>
        { sorted.length > 0 ? sorted.map((x) => renderSeries(x)) : <EmptyListItem /> }
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

  function renderSeries(name: string) {
    const id = tools.seriesPath(name);
    const link = `/series/${id}${showingOwned ? '?owned' : ''}`;
    return (
      <ListItem key={name} button divider component={Link} to={link}>
        <ListItemText>{ name }</ListItemText>
      </ListItem>
    );
  }
}
