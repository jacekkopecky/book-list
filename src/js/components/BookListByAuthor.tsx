import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import { Folder } from '@mui/icons-material';

import { Book, SetOwnedCallback, AddBookTrigger } from '../types';
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
  addBookTrigger: AddBookTrigger,
  readOnly?: boolean,
}

interface Series {
  title: string,
  books: Book[],
}

type BookOrSeries = Book | Series;

export default function BookListByAuthor(props: BookListProps): JSX.Element {
  const {
    books, authorPath, setOwned, addBookTrigger, readOnly,
  } = props;

  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const booksByAuthor = books.filter((b) => tools.authorPath(b.author) === authorPath);

  const selectedBooks = booksByAuthor.filter((b) => b.owned === showingOwned);

  const singleBook = selectedBooks.length === 1;

  const series = singleBook ? [] : findSeries(selectedBooks);

  const entries = [...selectedBooks, ...series];
  entries.sort((a, b) => tools.localeCompare(a.title, b.title));

  const navigate = useNavigate();
  const firstBook = booksByAuthor[0];
  if (!firstBook) {
    React.useEffect(() => {
      navigate(-1);
    });
    return <ErrorComponent text="empty book list – how did that happen?" />;
  }

  const prefix = showingOwned ? 'Books I Have By ' : 'Wanted Books By ';

  return (
    <MainHeading title={prefix + tools.authorName(firstBook.author)}>
      <List>
        { entries.length > 0 ? (
          entries.map((x) => renderBookOrSeries(x))
        ) : (
          <EmptyListItem text="no books" />
        ) }
      </List>
      <ActionButtons
        itemName="books"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
        addBook={readOnly
          ? undefined
          : () => addBookTrigger({ author: firstBook.author, owned: showingOwned })}
      />
    </MainHeading>
  );

  function renderBookOrSeries(x: BookOrSeries) {
    if (isBook(x)) {
      return (
        <BookEntry
          key={x.title}
          book={x}
          setOwned={setOwned}
          hideAuthor
          startExpanded={singleBook}
          readOnly={readOnly}
        />
      );
    } else {
      return (
        <BookSeriesList
          series={x}
          key={`${x.title} (series contents)`}
          setOwned={setOwned}
          readOnly={readOnly}
        />
      );
    }
  }
}

function isBook(x: BookOrSeries): x is Book {
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

interface BookSeriesListProps {
  series: Series,
  setOwned: SetOwnedCallback,
  readOnly?: boolean,
}

function BookSeriesList({ series, setOwned, readOnly }: BookSeriesListProps): JSX.Element {
  series.books.sort((a, b) => tools.localeCompare(a.title, b.title));
  const title = `${series.title} (series)`;

  return (
    <>
      <ListItem>
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
      <ListItem sx={(theme) => ({ paddingLeft: theme.spacing(4), paddingRight: 0 })}>
        <List disablePadding sx={{ width: '100%' }}>
          { series.books.map((book) => (
            <BookEntry
              key={book.title}
              book={book}
              setOwned={setOwned}
              hideAuthor
              readOnly={readOnly}
            />
          )) }
        </List>
      </ListItem>
    </>
  );
}
