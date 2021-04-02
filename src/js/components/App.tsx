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
import BookEdit from './BookEdit';

const DEFAULT_BOOKS = [
  {
    id: 1,
    title: 'It',
    author: { fname: 'Stephen', lname: 'King' },
    owned: false,
    mtime: Date.now(),
  },
  {
    id: 2,
    title: 'Something',
    owned: true,
    mtime: Date.now() - 30 * 1000,
  },
  {
    id: 3,
    title: 'Something Else',
    owned: true,
    mtime: Date.now() - 30 * 1000,
  },
  {
    id: 4,
    title: 'Light Fantastic',
    author: { fname: 'Toni', lname: 'Braxton' },
    owned: true,
    notes: 'lsdkjfoiwuer',
    mtime: Date.now() - 30 * 60 * 1000,
  },
  {
    id: 5,
    title: 'Slight Fantastic',
    series: 'Discworld',
    author: { fname: 'Toni', lname: 'Braxton' },
    notes: `Do esse expetendis mandaremus. Veniam iudicem instituendarum, id nam
      transferrem, veniam comprehenderit expetendis duis incididunt, magna probant non
      coniunctione, et noster consequat litteris, anim do ut tempor laborum ita irure
      quo in dolor admodum a iis quorum summis iis officia. Ita illum et quae, fabulas
      ea culpa, noster constias voluptate sed mandaremus quo mentitum. Quibusdam
      summis si laboris comprehenderit.Proident quid export se tempor an hic vidisse
      consectetur, mandaremus cillum nam offendit tractavissent, in eram possumus,
      dolor quo cernantur iis senserit praetermissum est possumus, deserunt amet malis
      probant quem, tempor possumus iudicem. Quo quo velit commodo, te sunt admodum
      consequat. Elit iis quamquam hic noster. Et incididunt voluptatibus, ut se duis
      probant ea se in noster quis noster, duis ut laborum ea export.`.replace(/[\n\s]+/g, ' '),
    owned: false,
    mtime: Date.now() - 10 * 60 * 60 * 1000,
  },
  {
    id: 6,
    title: 'Bright Fantastic',
    series: 'Discworld',
    author: { fname: 'Toni', lname: 'Braxton' },
    owned: false,
    mtime: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 7,
    title: '3',
    author: { fname: 'Ally', lname: 'Yence' },
    owned: false,
    mtime: Date.now() - 50 * 24 * 60 * 60 * 1000,
  },
  {
    id: 8,
    title: '4',
    author: { fname: 'Steven', lname: 'Zing' },
    owned: false,
    mtime: Date.now() - 350 * 24 * 60 * 60 * 1000,
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
          <BookListWithParams books={books} setOwned={setOwned} addBookTrigger={addBookTrigger} />
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
  setOwned: SetOwnedCallback,
  addBookTrigger: AddBookTrigger,
}

function BookListWithParams(props : BookListWithParamsProps): JSX.Element {
  const params = useParams<Record<'id', string>>();

  return (
    <BookListByAuthor
      {...props}
      authorPath={params.id}
    />
  );
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
