import * as React from 'react';
import { Link } from 'react-router-dom';

import { List, ListItemButton, ListItemText } from '@mui/material';

import { Book, AddBookTrigger } from '../types';
import * as tools from '../tools/tools';

import ActionButtons from './ActionButtons';
import EmptyListItem from './EmptyListItem';
import MainTabs from './MainTabs';

interface SeriesListProps {
  books: Book[],
  addBookTrigger: AddBookTrigger,
  readOnly?: boolean,
}

export default function SeriesList(props: SeriesListProps): JSX.Element {
  const { books, addBookTrigger, readOnly } = props;
  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const series = new Set<string>();

  const selectedBooks = books.filter((b) => b.owned === showingOwned);
  for (const book of selectedBooks) {
    if (book.series) series.add(book.series);
  }

  const sorted = Array.from(series).sort(tools.localeCompare);

  return (
    <MainTabs>
      <List>
        { sorted.length > 0 ? sorted.map(renderSeries) : <EmptyListItem text="no series" /> }
      </List>

      <ActionButtons
        itemName="series"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
        addBook={readOnly ? undefined : () => addBookTrigger({ owned: showingOwned })}
      />
    </MainTabs>
  );

  function renderSeries(name: string) {
    const id = tools.valuePath(name);
    const link = `/series/${id}${showingOwned ? '?owned' : ''}`;
    return (
      <ListItemButton key={name} divider component={Link} to={link}>
        <ListItemText>{ name }</ListItemText>
      </ListItemButton>
    );
  }
}
