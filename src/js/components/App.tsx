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
import * as api from '../tools/api';

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

import AuthorList from './AuthorList';
import SeriesList from './SeriesList';
import ErrorComponent from './ErrorComponent';
import BookListByAuthor from './BookListByAuthor';
import BookListBySeries from './BookListBySeries';
import BookEdit from './BookEdit';
import Login from './Login';
import Admin from './Admin';

export default function App(): JSX.Element {
  return <Router><AppInsideRouter /></Router>;
}

function AppInsideRouter(): JSX.Element {
  // state for application
  const [state, setState] = React.useState<AppState>(AppState.starting);
  const [customMessage, setCustomMessage] = React.useState('');
  const [email, setEmail] = React.useState<string>();
  const [bookTemplate, setBookTemplate] = React.useState<Partial<NewBook>>({});

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

  const history = useHistory();

  const addBookTrigger: AddBookTrigger = (template = {}) => {
    setBookTemplate(template);
    history.push('/new');
  };

  const setStateAndEmail = (s: AppState, e?: string) => {
    setState(s);
    if (s === AppState.loggedIn) {
      setEmail(e);
    } else {
      setEmail(undefined);
    }
  };

  React.useEffect(() => {
    if (email) {
      (async () => {
        setState(AppState.progress);
        setCustomMessage('loading your books from the cloud');

        const booksAndBin = await api.loadBooks();

        setBooks(booksAndBin.books);
        setBin(booksAndBin.bin);
        setState(AppState.connected);
      })().catch((e) => {
        console.error(e);
        setState(AppState.error);
      });
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
      case AppState.connected: return (
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
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      );
      case AppState.starting: return (
        <Container {...containerProps} className="messageOnly">
          <Typography>Starting…</Typography>
        </Container>
      );
      case AppState.progress: return (
        <Container {...containerProps} className="messageOnly">
          <Typography>{ customMessage || 'Please wait…' }</Typography>
        </Container>
      );
      case AppState.loggedIn: return (
        <Container {...containerProps} className="messageOnly">
          <CircularProgress />
          <Typography>Loading books…</Typography>
        </Container>
      );
      case AppState.loggedOut: return (
        <Container {...containerProps} className="messageOnly">
          <Typography>Please log in.</Typography>
        </Container>
      );
      case AppState.error:
      default: return (
        <ErrorComponent text="error, please try later" />
      );
    }
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
