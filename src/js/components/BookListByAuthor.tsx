import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Folder from '@material-ui/icons/Folder';

import { Book, SetOwnedCallback } from '../types';
import * as tools from '../tools/tools';

import ActionButtons from './ActionButtons';
import BookEntry from './BookEntry';
import EmptyListItem from './EmptyListItem';
import ErrorComponent from './ErrorComponent';
import MainHeading from './MainHeading';

interface BookListProps {
  books: Book[],
  authorPath: string,
  setOwned: SetOwnedCallback,
}

interface Series {
  title: string,
  books: Book[],
}

type BookOrSeries = Book | Series;

export default function BookListByAuthor(props: BookListProps): JSX.Element {
  const { books, authorPath, setOwned } = props;

  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const booksByAuthor = books.filter((b) => tools.authorPath(b.author) === authorPath);

  const selectedBooks = booksByAuthor.filter((b) => b.owned === showingOwned);

  const series = findSeries(selectedBooks);

  const entries = [...selectedBooks, ...series];
  entries.sort((a, b) => a.title.localeCompare(b.title));

  const history = useHistory();
  const firstBook = booksByAuthor[0];
  if (!firstBook) {
    React.useEffect(() => {
      history.goBack();
    });
    return <ErrorComponent text="empty book list – how did that happen?" />;
  }

  const prefix = showingOwned ? 'Books I Have By ' : 'Wanted Books By ';

  return (
    <MainHeading title={prefix + tools.authorName(firstBook.author)}>
      <List className="BookListByAuthor">
        { entries.length > 0 ? entries.map((x) => renderBookOrSeries(x, setOwned)) : <EmptyListItem text="no books" /> }
      </List>
      <ActionButtons
        itemName="books"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
      />
    </MainHeading>
  );
}

function isBook(x: BookOrSeries) : x is Book {
  return 'id' in x && x.id != null;
}

function findSeries(books: Book[]): Series[] {
  const seriesMap = new Map<string, Series>();
  for (const book of books) {
    if (book.series) {
      let series = seriesMap.get(book.series);
      if (!series) {
        series = {
          title: book.series,
          books: [],
        };
        seriesMap.set(book.series, series);
      }
      series.books.push(book);
    }
  }

  return Array.from(seriesMap.values());
}

function renderBookOrSeries(x: BookOrSeries, setOwned: SetOwnedCallback) {
  if (isBook(x)) {
    return renderBook(x, setOwned);
  } else {
    return <BookSeriesList series={x} key={`${x.title} (series contents)`} setOwned={setOwned} />;
  }
}

function renderBook(book: Book, setOwned: SetOwnedCallback) {
  return (
    <BookEntry key={book.title} book={book} setOwned={setOwned} />
  );
}

const useStyles = makeStyles((theme) => createStyles({
  nested: {
    paddingLeft: theme.spacing(4),
    paddingRight: '0',
  },
  wide: {
    width: '100%',
  },
}));

interface BookSeriesListProps {
  series: Series,
  setOwned: SetOwnedCallback,
}

function BookSeriesList({ series, setOwned }: BookSeriesListProps): JSX.Element {
  const classes = useStyles();

  series.books.sort((a, b) => a.title.localeCompare(b.title));
  const title = `${series.title} (series)`;

  return (
    <>
      <ListItem>
        <ListItemIcon><Folder /></ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
      <ListItem className={classes.nested}>
        <List disablePadding className={classes.wide}>
          { series.books.map((b) => renderBook(b, setOwned)) }
        </List>
      </ListItem>
    </>
  );
}
