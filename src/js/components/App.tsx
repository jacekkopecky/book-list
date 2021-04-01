import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation,
} from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import { ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import theme, { containerProps } from './theme';

import { Book } from '../types';

import AuthorList from './AuthorList';
import SeriesList from './SeriesList';
import BookListByAuthor from './BookListByAuthor';
import MainAppBar from './MainAppBar';

const DEFAULT_BOOKS = [
  {
    id: '345',
    title: 'It',
    author: { fname: 'Stephen', lname: 'King' },
    owned: false,
    mtime: Date.now(),
  },
  {
    id: '345',
    title: 'Something',
    owned: true,
    mtime: Date.now() - 30 * 1000,
  },
  {
    id: '345',
    title: 'Something Else',
    owned: true,
    mtime: Date.now() - 30 * 1000,
  },
  {
    id: '385',
    title: 'Light Fantastic',
    author: { fname: 'Toni', lname: 'Braxton' },
    owned: true,
    notes: 'lsdkjfoiwuer',
    mtime: Date.now() - 30 * 60 * 1000,
  },
  {
    id: '385',
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
      probant ea se in noster quis noster, duis ut laborum ea export.`,
    owned: false,
    mtime: Date.now() - 10 * 60 * 60 * 1000,
  },
  {
    id: '385',
    title: 'Bright Fantastic',
    series: 'Discworld',
    author: { fname: 'Toni', lname: 'Braxton' },
    owned: false,
    mtime: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: '367',
    title: '3',
    author: { fname: 'Ally', lname: 'Yence' },
    owned: false,
    mtime: Date.now() - 50 * 24 * 60 * 60 * 1000,
  },
  {
    id: '367',
    title: '4',
    author: { fname: 'Steven', lname: 'Zing' },
    owned: false,
    mtime: Date.now() - 350 * 24 * 60 * 60 * 1000,
  },
];

export default function App(): JSX.Element {
  const [books/* , setBooks */] = React.useState<Book[]>(DEFAULT_BOOKS);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />

        <Switch>
          <Route exact path="/">
            <AuthorList books={books} />
          </Route>
          <Route exact path="/series">
            <SeriesList books={books} />
          </Route>
          <Route exact path="/author/:id">
            <BookListWithParams books={books} />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

function BookListWithParams({ books } : { books: Book[] }): JSX.Element {
  const params = useParams<Record<'id', string>>();

  return (
    <BookListByAuthor
      books={books}
      authorPath={params.id}
    />
  );
}

function NotFound() {
  const location = useLocation();

  return (
    <>
      <MainAppBar />
      <Container {...containerProps}>
        <p>404 page not found: { location.pathname }</p>
      </Container>
    </>
  );
}
