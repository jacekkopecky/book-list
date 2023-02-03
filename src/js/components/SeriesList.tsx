import * as React from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem, ListItemText } from '@material-ui/core';

import { Book, AddBookTrigger } from '../types';
import * as tools from '../tools/tools';

import ActionButtons from './ActionButtons';
import EmptyListItem from './EmptyListItem';
import MainTabs from './MainTabs';

interface SeriesListProps {
  books: Book[],
  addBookTrigger: AddBookTrigger,
}

export default function SeriesList({ books, addBookTrigger }: SeriesListProps): JSX.Element {
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
        addBook={() => addBookTrigger({ owned: showingOwned })}
      />
    </MainTabs>
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
