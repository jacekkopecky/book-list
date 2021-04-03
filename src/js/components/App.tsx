import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation,
  useHistory,
} from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import theme, { containerProps } from './theme';
import * as tools from '../tools/tools';

import {
  Book,
  NewBook,
  SetOwnedCallback,
  SaveBookCallback,
  DeleteBookCallback,
  AddBookCallback,
  AddBookTrigger,
  LoginState,
} from '../types';

import AuthorList from './AuthorList';
import SeriesList from './SeriesList';
import ErrorComponent from './ErrorComponent';
import BookListByAuthor from './BookListByAuthor';
import BookListBySeries from './BookListBySeries';
import BookEdit from './BookEdit';
import Login from './Login';

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
  const [state, setState] = React.useState<LoginState>(LoginState.starting);
  const [email, setEmail] = React.useState<string>();
  const [books, setBooks] = tools.useLocalStorage<Book[]>('bookList', DEFAULT_BOOKS);
  const [bin, setBin] = tools.useLocalStorage<Book[]>('bookBin', []);
  const [bookTemplate, setBookTemplate] = React.useState<Partial<NewBook>>({});

  const saveBook: SaveBookCallback = (book) => {
    const newBooks = books.filter((b) => b.id !== book.id);
    book.mtime = Date.now();
    newBooks.push(book);
    setBooks(newBooks);
  };

  const deleteBook: DeleteBookCallback = (book) => {
    const oldBook = books.find((b) => b.id === book.id);
    if (!oldBook) return; // nothing to do

    // put the old book in the bin
    const binnedBook = {
      ...oldBook,
      mtime: Date.now(),
    };
    const newBin = [...bin, binnedBook];
    setBin(newBin);

    // remove it from books
    const newBooks = books.filter((b) => b.id !== book.id);
    setBooks(newBooks);
  };

  const addBook: AddBookCallback = (newBook) => {
    const newBooks = Array.from(books);
    const book: Book = {
      id: nextId,
      mtime: Date.now(),
      ...newBook,
    };
    nextId += 1;
    newBooks.push(book);
    setBooks(newBooks);
  };

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

  const setStateAndEmail = (s: LoginState, e?: string) => {
    setState(s);
    if (s === LoginState.loggedIn) {
      setEmail(e);
    } else {
      setEmail(undefined);
    }
  };

  React.useEffect(() => {
    if (email) {
      void loadBooks();
    }
  }, [email]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            bananas for books
            { /* when changing the title above, also change it in index.html and 404.html */ }
          </Typography>
          <Login state={state} setState={setStateAndEmail} />
        </Toolbar>
      </AppBar>

      { mainContent() }
    </ThemeProvider>
  );

  function mainContent(): JSX.Element {
    switch (state) {
      case LoginState.connected: return (
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
            <BookEditWithParams books={books} save={saveBook} delete={deleteBook} />
          </Route>
          <Route exact path="/new">
            <BookEdit originalBook={bookTemplate} add={addBook} />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      );
      case LoginState.starting: return (
        <Container {...containerProps} className="loading">
          <Typography>Starting…</Typography>
        </Container>
      );
      case LoginState.loggedIn: return (
        <Container {...containerProps} className="loading">
          <CircularProgress />
          <Typography>Loading books…</Typography>
        </Container>
      );
      case LoginState.loggedOut: return (
        <Container {...containerProps} className="loading">
          <Typography>Please log in.</Typography>
        </Container>
      );
      case LoginState.error:
      default: return (
        <ErrorComponent text="error, please try later" />
      );
    }
  }

  function loadBooks() {
    setState(LoginState.connected);
  }
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
  delete: DeleteBookCallback,
}

function BookEditWithParams(props: BookEditWithParamsProps): JSX.Element {
  const params = useParams<Record<'id', string>>();

  const book = props.books.find((b) => String(b.id) === params.id);
  if (!book) {
    return <ErrorComponent text={`cannot find book for id ${params.id}`} />;
  }

  return (
    <BookEdit
      originalBook={book}
      save={props.save}
      delete={props.delete}
    />
  );
}

function NotFound() {
  const location = useLocation();

  return <ErrorComponent text={`404 page not found: ${location.pathname}`} />;
}
