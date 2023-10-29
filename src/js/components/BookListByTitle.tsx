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
  titlePath: string,
  setOwned: SetOwnedCallback,
  addBookTrigger: AddBookTrigger,
  readOnly?: boolean,
}

export default function BookListByTitle(props: BookListProps): JSX.Element {
  const {
    books, titlePath, setOwned, addBookTrigger, readOnly,
  } = props;

  const [showingOwned, setShowingOwned] = tools.useShowingOwned();

  const booksByTitle = books.filter((b) => tools.valuePath(b.title) === titlePath);

  const selectedBooks = booksByTitle.filter((b) => b.owned === showingOwned);
  selectedBooks.sort((a, b) => a.title.localeCompare(b.title));

  const singleBook = selectedBooks.length === 1;

  const navigate = useNavigate();
  const firstBook = booksByTitle[0];
  if (!firstBook) {
    React.useEffect(() => {
      navigate(-1);
    });
    return <ErrorComponent text="empty book list – how did that happen?" />;
  }

  const title = showingOwned
    ? `Books I Have Titled ${firstBook.title}`
    : `Wanted Books Titled ${firstBook.title}`;

  const addBookTemplate: Partial<NewBook> = {
    owned: showingOwned,
  };

  return (
    <MainHeading title={title}>
      <List>
        { selectedBooks.length > 0 ? (
          selectedBooks.map((book) => (
            <BookEntry
              key={book.id}
              book={book}
              setOwned={setOwned}
              startExpanded={singleBook}
              readOnly={readOnly}
            />
          ))
        ) : (
          <EmptyListItem text="no books" />
        ) }
      </List>
      <ActionButtons
        itemName="books"
        onSwitchOwned={setShowingOwned}
        showingOwned={showingOwned}
        addBook={readOnly ? undefined : () => addBookTrigger(addBookTemplate)}
      />
    </MainHeading>
  );
}
