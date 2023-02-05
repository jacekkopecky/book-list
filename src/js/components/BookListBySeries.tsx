import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { List } from '@mui/material';

import {
  Book, SetOwnedCallback, AddBookTrigger, NewBook,
} from '../types';
import * as tools from '../tools/tools';

import ActionButtons from './ActionButtons';
import BookEntry from './BookEntry';
import EmptyListItem from './EmptyListItem';
import ErrorComponent from './ErrorComponent';
import MainHeading from './MainHeading';

interface BookListProps {
  books: Book[],
  seriesPath: string,
  setOwned: SetOwnedCallback,
  addBookTrigger: AddBookTrigger,
}

type BookInSeries = Book & Required<Pick<Book, 'series'>>;

export default function BookListBySeries(props: BookListProps): JSX.Element {
  const {
    books, seriesPath, setOwned, addBookTrigger,
  } = props;

  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const booksInSeries = selectBooksInSeries(books, seriesPath);

  const singleAuthor = new Set(booksInSeries.map((b) => tools.authorName(b.author))).size === 1;

  const selectedBooks = booksInSeries.filter((b) => b.owned === showingOwned);

  selectedBooks.sort((a, b) => a.title.localeCompare(b.title));

  const navigate = useNavigate();
  const firstBook = booksInSeries[0];
  if (!firstBook) {
    React.useEffect(() => {
      navigate(-1);
    });
    return <ErrorComponent text="empty book list – how did that happen?" />;
  }

  const titlePrefix = showingOwned
    ? `Books I Have In ${firstBook.series} Series`
    : `Wanted Books In ${firstBook.series} Series`;
  const titleAuthor = `(By ${tools.authorName(firstBook.author)})`.replace(/\s/g, '\u00a0');

  const title = singleAuthor ? `${titlePrefix} ${titleAuthor}` : titlePrefix;

  const addBookTemplate: Partial<NewBook> = {
    series: firstBook.series,
    owned: showingOwned,
  };
  if (singleAuthor && firstBook.author) {
    addBookTemplate.author = { ...firstBook.author };
  }

  return (
    <MainHeading title={title}>
      <List>
        { selectedBooks.length > 0 ? (
          selectedBooks.map((x) => renderBook(x, setOwned, singleAuthor))
        ) : (
          <EmptyListItem text="no books" />
        ) }
      </List>
      <ActionButtons
        itemName="books"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
        addBook={() => addBookTrigger(addBookTemplate)}
      />
    </MainHeading>
  );
}

function renderBook(book: BookInSeries, setOwned: SetOwnedCallback, singleAuthor: boolean) {
  return <BookEntry key={book.title} book={book} setOwned={setOwned} hideAuthor={singleAuthor} />;
}

function selectBooksInSeries(books: Book[], seriesPath: string): BookInSeries[] {
  const retval: BookInSeries[] = [];
  for (const book of books) {
    if (hasSeries(book) && tools.seriesPath(book.series) === seriesPath) retval.push(book);
  }
  return retval;
}

function hasSeries(book: Book): book is BookInSeries {
  return Boolean(book.series?.trim());
}
