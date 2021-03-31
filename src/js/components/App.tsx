import * as React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  useParams,
  useLocation,
} from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import theme from './theme';

import { Book } from '../types';

import AuthorList from './AuthorList';
import BookListByAuthor from './BookListByAuthor';

const DEFAULT_BOOKS = [
  {
    id: '345',
    title: 'It',
    author: { fname: 'Steven', lname: 'King' },
    owned: false,
    mtime: Date.now(),
  },
  {
    id: '345',
    title: 'Something',
    owned: false,
    mtime: Date.now() - 30 * 1000,
  },
  {
    id: '385',
    title: 'Light Fantastic',
    author: { fname: 'Toni', lname: 'Braxton' },
    owned: false,
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
    author: { fname: 'Stephen', lname: 'Zing' },
    owned: false,
    mtime: Date.now() - 350 * 24 * 60 * 60 * 1000,
  },
];

export default function App(): JSX.Element {
  const [books/* , setBooks */] = React.useState<Book[]>(DEFAULT_BOOKS);

  const narrow = useMediaQuery(theme.breakpoints.down('xs'));

  const appBar = (
    <AppBar position="static" style={{ zIndex: 1, position: 'relative' }}>
      <Toolbar><h1>bananas for books</h1></Toolbar>
      { /* when changing the title above, also change it in index.html and 404.html */ }
    </AppBar>
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />

        <Switch>
          <Route exact path="/">
            { !narrow && appBar }
            <MainTabs narrow={narrow}>
              <AuthorList books={books} />
            </MainTabs>
          </Route>
          <Route exact path="/series">
            { !narrow && appBar }
            <MainTabs narrow={narrow}>
              <SeriesList books={books} />
            </MainTabs>
          </Route>
          <Route exact path="/author/:id">
            { !narrow && appBar }
            <BookListWithParams books={books} />
          </Route>
          <Route path="*">
            { appBar }
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

const containerProps = {
  component: 'main' as const,
  maxWidth: 'sm' as const,
  style: {
    backgroundColor: theme.palette.background.paper,
  },
};

interface MainTabsProps {
  narrow: boolean,
  children?: React.ReactNode,
}

function MainTabs({ narrow, children }: MainTabsProps): JSX.Element {
  const location = useLocation();

  return narrow
    ? (
      <>
        <AppBar position="relative">
          <Toolbar>
            <Tabs value={location.pathname}>
              <Tab component={Link} value="/" label="Authors" to="/" />
              <Tab component={Link} value="/series" label="Series" to="/series" />
            </Tabs>
          </Toolbar>
        </AppBar>
        <Container {...containerProps}>
          <>
            { children }
          </>
        </Container>
      </>
    ) : (
      <Container {...containerProps}>
        <Tabs value={location.pathname} textColor="primary" indicatorColor="primary">
          <Tab component={Link} value="/" label="Authors" to="/" />
          <Tab component={Link} value="/series" label="Series" to="/series" />
        </Tabs>
        { children }
      </Container>
    );
}

function NotFound() {
  const location = useLocation();

  return (
    <Container {...containerProps}>
      <p>404 page not found: { location.pathname }</p>
    </Container>
  );
}

function SeriesList({ books }: { books: Book[] }): JSX.Element {
  return <p>not implemented</p>;
}
