import * as React from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { Book } from '../types';
import * as tools from '../tools/tools';

import ActionButtons from './ActionButtons';
import EmptyListItem from './EmptyListItem';
import MainTabs from './MainTabs';

export default function SeriesList({ books }: { books: Book[] }): JSX.Element {
  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const series = new Set<string>();

  const selectedBooks = books.filter((b) => b.owned === showingOwned);
  for (const book of selectedBooks) {
    if (book.series) series.add(book.series);
  }

  const sorted = Array.from(series).sort();

  return (
    <MainTabs>
      <List>
        { sorted.length > 0 ? sorted.map((x) => renderSeries(x)) : <EmptyListItem /> }
      </List>

      <ActionButtons
        itemName="series"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
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
