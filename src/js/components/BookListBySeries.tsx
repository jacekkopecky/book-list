import * as React from 'react';
import { useHistory } from 'react-router-dom';

import List from '@material-ui/core/List';

import { Book, SetOwnedCallback, AddBookTrigger } from '../types';
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
    books,
    seriesPath,
    setOwned,
    addBookTrigger,
  } = props;

  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const booksInSeries = selectBookInSeries(books, seriesPath);

  const selectedBooks = booksInSeries.filter((b) => b.owned === showingOwned);

  selectedBooks.sort((a, b) => a.title.localeCompare(b.title));

  const history = useHistory();
  const firstBook = booksInSeries[0];
  if (!firstBook) {
    React.useEffect(() => {
      history.goBack();
    });
    return <ErrorComponent text="empty book list – how did that happen?" />;
  }

  // todo write the prefix
  const title = showingOwned ? `Books I Have In ${firstBook.series} Series` : `Wanted Books In ${firstBook.series} Series`;

  return (
    <MainHeading title={title}>
      <List className="BookListBySeries">
        { selectedBooks.length > 0 ? selectedBooks.map((x) => renderBook(x, setOwned)) : <EmptyListItem text="no books" /> }
      </List>
      <ActionButtons
        itemName="books"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
        addBook={() => addBookTrigger({ series: firstBook.series, owned: showingOwned })}
      />
    </MainHeading>
  );
}

function renderBook(book: BookInSeries, setOwned: SetOwnedCallback) {
  return (
    <BookEntry key={book.title} book={book} setOwned={setOwned} />
  );
}

function selectBookInSeries(books: Book[], seriesPath: string): BookInSeries[] {
  const retval: BookInSeries[] = [];
  for (const book of books) {
    if (hasSeries(book) && tools.seriesPath(book.series) === seriesPath) retval.push(book);
  }
  return retval;
}

function hasSeries(book: Book): book is BookInSeries {
  return Boolean(book.series?.trim());
}
