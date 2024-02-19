import { Auth0Provider } from '@auth0/auth0-react';
import * as React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  AppBar,
  CircularProgress,
  CssBaseline,
  Toolbar,
  Typography,
  ThemeProvider,
  Stack,
  Link,
} from '@mui/material';

import { config, useApi } from '../tools/api';
import {
  Book,
  NewBook,
  SetOwnedCallback,
  SaveBookCallback,
  DeleteBookCallback,
  AddBookCallback,
  AddBookTrigger,
  AppState,
} from '../types';

import theme from './theme';
import AuthorList from './AuthorList';
import SeriesList from './SeriesList';
import TitleList from './TitleList';
import ErrorComponent from './ErrorComponent';
import BookListByAuthor from './BookListByAuthor';
import BookListByTitle from './BookListByTitle';
import BookListBySeries from './BookListBySeries';
import BookEdit from './BookEdit';
import Login from './Login';
import Admin from './Admin';
import Main from './Main';

export default function App(): JSX.Element {
  return (
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: config.auth0.audience,
      }}
      useRefreshTokens
    >
      <Router>
        <AppInsideRouter />
      </Router>
    </Auth0Provider>
  );
}

function AppInsideRouter(): JSX.Element {
  // state for application
  const [state, setState] = React.useState<AppState>(
    navigator.onLine ? AppState.starting : AppState.loggedOut,
  );
  const [customMessage, setCustomMessage] = React.useState('');
  const [email, setEmail] = React.useState<string>();
  const [bookTemplate, setBookTemplate] = React.useState<Partial<NewBook>>({});
  const api = useApi();

  // state that holds the actual books
  const [books, setBooks] = React.useState<Book[]>([]);
  const [, setBin] = React.useState<Book[]>([]); // ignoring the bin for now

  const saveBook: SaveBookCallback = async (book) => {
    try {
      setState(AppState.progress);
      setCustomMessage('saving your book');

      const savedBook = await api.saveBook(book);
      const newBooks = books.filter((b) => b.id !== savedBook.id);
      newBooks.push(savedBook);

      setBooks(newBooks);
      setState(AppState.connected);
    } catch (e) {
      console.error(e);
      setState(AppState.error);
    }
  };

  const deleteBook: DeleteBookCallback = async (book) => {
    try {
      setState(AppState.progress);
      setCustomMessage('deleting the book');

      const newBin = await api.deleteBook(book);
      setBin(newBin);

      // remove it from books
      const newBooks = books.filter((b) => b.id !== book.id);
      setBooks(newBooks);
      setState(AppState.connected);
    } catch (e) {
      console.error(e);
      setState(AppState.error);
    }
  };

  const addBook: AddBookCallback = async (newBook) => {
    try {
      setState(AppState.progress);
      setCustomMessage('adding the book');

      const newBooks = Array.from(books);
      const book = await api.submitNewBook(newBook);
      newBooks.push(book);

      setBooks(newBooks);
      setState(AppState.connected);
    } catch (e) {
      console.error(e);
      setState(AppState.error);
    }
  };

  const setOwned = (book: Book, owned: boolean) => {
    const newBook = {
      ...book,
      owned,
    };
    saveBook(newBook);
  };

  const navigate = useNavigate();

  const addBookTrigger: AddBookTrigger = (template = {}) => {
    setBookTemplate(template);
    navigate('/new');
  };

  const setStateAndEmail = (s: AppState, e?: string) => {
    if (s === AppState.loggedIn) {
      setEmail(e);
    } else {
      setEmail(undefined);
    }
    setState(s);
  };

  React.useEffect(() => {
    if (email && state === AppState.loggedIn) {
      (async () => {
        setState(AppState.progress);
        setCustomMessage('Loading your books from the cloud…');

        const booksAndBin = await api.loadBooks();

        setBooks(booksAndBin.books);
        setBin(booksAndBin.bin);
        setState(AppState.connected);
      })().catch((e) => {
        console.error(e);
        setState(AppState.error);
      });

      api.registerWebPush().catch((e) => {
        console.error('ignoring error registering for web push', e);
      });
    } else if (state === AppState.loggedOut && !navigator.onLine) {
      (async () => {
        const booksAndBin = await api.loadOfflineBooks();
        if (booksAndBin) {
          setBooks(booksAndBin.books);
          setBin(booksAndBin.bin);
          setState(AppState.offline);
        }
      })().catch((e) => {
        console.error(e);
        setState(AppState.error);
      });
    }
  }, [email, state]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ zIndex: 1000 }}>
        <Toolbar>
          <Link
            href="/"
            variant="h5"
            color="inherit"
            sx={{ flexGrow: 1 }}
            underline="none"
          >
            bananas for books
            { /* when changing the title above, also change it in index.html and 404.html */ }
          </Link>
          <Login state={state} setState={setStateAndEmail} />
        </Toolbar>
      </AppBar>

      { mainContent() }
    </ThemeProvider>
  );

  function mainContent(): JSX.Element {
    const offline = state === AppState.offline;
    switch (state) {
      case AppState.connected:
      case AppState.offline:
        return (
          <Routes>
            <Route
              path="/"
              element={(
                <AuthorList
                  books={books}
                  addBookTrigger={addBookTrigger}
                  readOnly={offline}
                />
              )}
            />
            <Route
              path="/series"
              element={(
                <SeriesList
                  books={books}
                  addBookTrigger={addBookTrigger}
                  readOnly={offline}
                />
              )}
            />
            <Route
              path="/singles"
              element={(
                <TitleList
                  books={books}
                  addBookTrigger={addBookTrigger}
                  singlesOnly
                  readOnly={offline}
                />
              )}
            />
            <Route
              path="/author/:id"
              element={(
                <BookListWithParams
                  variant="author"
                  books={books}
                  setOwned={setOwned}
                  addBookTrigger={addBookTrigger}
                  readOnly={offline}
                />
              )}
            />
            <Route
              path="/series/:id"
              element={(
                <BookListWithParams
                  variant="series"
                  books={books}
                  setOwned={setOwned}
                  addBookTrigger={addBookTrigger}
                  readOnly={offline}
                />
              )}
            />
            <Route
              path="/title/:id"
              element={(
                <BookListWithParams
                  variant="title"
                  books={books}
                  setOwned={setOwned}
                  addBookTrigger={addBookTrigger}
                  readOnly={offline}
                />
              )}
            />
            <Route
              path="/edit/:id"
              element={(
                <BookEditWithParams
                  books={books}
                  save={saveBook}
                  delete={deleteBook}
                  readOnly={offline}
                />
              )}
            />
            <Route
              path="/new"
              element={
                offline ? <MessageOnly message="Cannot add a new book when offline (yet)" />
                  : <BookEdit knownBooks={books} originalBook={bookTemplate} add={addBook} />
              }
            />
            <Route
              path="/admin"
              element={
                offline ? <MessageOnly message="Cannot use admin when offline (yet)" />
                  : <Admin />
              }
            />
            <Route
              path="*"
              element={
                <NotFound />
              }
            />
          </Routes>
        );
      case AppState.starting:
        return (
          <MessageOnly message="Starting…" withSpinner />
        );
      case AppState.loggedIn:
      case AppState.progress:
        return (
          <MessageOnly message={customMessage || 'Please wait…'} withSpinner />
        );
      case AppState.loggedOut:
        return (
          <MessageOnly message="Please log in." />
        );
      case AppState.error:
      default:
        return <ErrorComponent text="error, please try later" />;
    }
  }
}

interface BookListWithParamsProps {
  books: Book[],
  variant: 'author' | 'series' | 'title',
  setOwned: SetOwnedCallback,
  addBookTrigger: AddBookTrigger,
  readOnly?: boolean,
}

function BookListWithParams(props: BookListWithParamsProps): JSX.Element {
  const params = useParams<Record<'id', string>>();

  switch (props.variant) {
    case 'author':
      return <BookListByAuthor {...props} authorPath={params.id ?? ''} />;
    case 'series':
      return <BookListBySeries {...props} seriesPath={params.id ?? ''} />;
    case 'title':
      return <BookListByTitle {...props} titlePath={params.id ?? ''} />;
  }
}

interface BookEditWithParamsProps {
  books: Book[],
  save: SaveBookCallback,
  delete: DeleteBookCallback,
  readOnly?: boolean,
}

function BookEditWithParams(props: BookEditWithParamsProps): JSX.Element {
  const params = useParams<Record<'id', string>>();

  const book = props.books.find((b) => String(b.id) === params.id);
  if (!book) {
    return <ErrorComponent text={`cannot find book for id ${params.id ?? ''}`} />;
  }

  return (
    <BookEdit
      originalBook={book}
      knownBooks={props.books}
      save={props.save}
      delete={props.delete}
      readOnly={props.readOnly}
    />
  );
}

function NotFound() {
  const location = useLocation();

  return <ErrorComponent text={`404 page not found: ${location.pathname}`} />;
}

interface MessageOnlyProps {
  message: string,
  withSpinner?: boolean,
}

function MessageOnly({ message, withSpinner } : MessageOnlyProps) {
  return (
    <Main>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
      >
        <Typography>{ message }</Typography>
        { withSpinner && <CircularProgress style={{ marginTop: '1em' }} /> }
      </Stack>
    </Main>
  );
}
