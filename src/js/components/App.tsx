import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation,
  useHistory,
} from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

import { ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import theme from './theme';
import * as tools from '../tools/tools';

import {
  Book,
  NewBook,
  SetOwnedCallback,
  SaveBookCallback,
  AddBookCallback,
  AddBookTrigger,
} from '../types';

import AuthorList from './AuthorList';
import SeriesList from './SeriesList';
import ErrorComponent from './ErrorComponent';
import BookListByAuthor from './BookListByAuthor';
import BookListBySeries from './BookListBySeries';
import BookEdit from './BookEdit';

const DEFAULT_BOOKS = [
  {
    id: 1,
    title: 'Sample Book',
    author: { fname: 'Stephen', lname: 'Austen' },
    notes: 'you can remove this book',
    owned: false,
    mtime: Date.now(),
  },
];

let nextId = Math.max(...DEFAULT_BOOKS.map((b) => b.id)) + 1;

export default function App(): JSX.Element {
  return <Router><AppInsideRouter /></Router>;
}

function AppInsideRouter(): JSX.Element {
  const [books, setBooks] = tools.useLocalStorage<Book[]>('bookList', DEFAULT_BOOKS);
  const [bookTemplate, setBookTemplate] = React.useState<Partial<NewBook>>({});

  const saveBook: SaveBookCallback = (book) => {
    const newBooks = books.filter((b) => b.id !== book.id);
    book.mtime = Date.now();
    newBooks.push(book);
    setBooks(newBooks);
  };

  const addBook: AddBookCallback = (newBook) => {
    const newBooks = Array.from(books);
    const book: Book = {
      id: nextId,
      mtime: Date.now(),
      ...newBook,
    };
    newBooks.push(book);
    setBooks(newBooks);
  };

  nextId += 1;

  const setOwned = (book: Book, owned: boolean) => {
    const newBook = {
      ...book,
      owned,
    };
    saveBook(newBook);
  };

  const history = useHistory();

  const addBookTrigger: AddBookTrigger = (template = {}) => {
    setBookTemplate(template);
    history.push('/new');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Switch>
        <Route exact path="/">
          <AuthorList books={books} addBookTrigger={addBookTrigger} />
        </Route>
        <Route exact path="/series">
          <SeriesList books={books} addBookTrigger={addBookTrigger} />
        </Route>
        <Route exact path="/author/:id">
          <BookListWithParams variant="author" books={books} setOwned={setOwned} addBookTrigger={addBookTrigger} />
        </Route>
        <Route exact path="/series/:id">
          <BookListWithParams variant="series" books={books} setOwned={setOwned} addBookTrigger={addBookTrigger} />
        </Route>
        <Route exact path="/edit/:id">
          <BookEditWithParams books={books} save={saveBook} />
        </Route>
        <Route exact path="/new">
          <BookEdit originalBook={bookTemplate} add={addBook} />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

interface BookListWithParamsProps {
  books: Book[],
  variant: 'author' | 'series',
  setOwned: SetOwnedCallback,
  addBookTrigger: AddBookTrigger,
}

function BookListWithParams(props : BookListWithParamsProps): JSX.Element {
  const params = useParams<Record<'id', string>>();

  switch (props.variant) {
    case 'author':
      return (
        <BookListByAuthor
          {...props}
          authorPath={params.id}
        />
      );
    case 'series':
      return (
        <BookListBySeries
          {...props}
          seriesPath={params.id}
        />
      );
  }
}

interface BookEditWithParamsProps {
  books: Book[],
  save: SaveBookCallback,
}

function BookEditWithParams({ books, save } : BookEditWithParamsProps): JSX.Element {
  const params = useParams<Record<'id', string>>();

  const book = books.find((b) => String(b.id) === params.id);
  if (!book) {
    return <ErrorComponent text={`cannot find book for id ${params.id}`} />;
  }

  return (
    <BookEdit
      originalBook={book}
      save={save}
    />
  );
}

function NotFound() {
  const location = useLocation();

  return <ErrorComponent text={`404 page not found: ${location.pathname}`} />;
}
