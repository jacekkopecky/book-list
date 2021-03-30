import * as React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  useParams,
} from 'react-router-dom';

import './App.css';

import { Book } from '../types';

import AuthorList from './AuthorList';
import BookListByAuthor from './BookListByAuthor';

export default function App(): JSX.Element {
  const [books/* , setBooks */] = React.useState<Book[]>([
    {
      id: '345',
      title: 'It',
      author: { fname: 'Steven', lname: 'King' },
      owned: true,
      mtime: 10,
    },
    {
      id: '385',
      title: 'Light Fantastic',
      author: { fname: 'Toni', lname: 'Braxton' },
      owned: true,
      notes: 'lsdkjfoiwuer',
      mtime: 10,
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
      owned: true,
      mtime: 10,
    },
    {
      id: '385',
      title: 'Bright Fantastic',
      series: 'Discworld',
      author: { fname: 'Toni', lname: 'Braxton' },
      owned: true,
      mtime: 10,
    },
    {
      id: '367',
      title: '3',
      author: { fname: 'Ally', lname: 'Yence' },
      owned: true,
      mtime: 10,
    },
    {
      id: '367',
      title: '4',
      author: { fname: 'Stephen', lname: 'Zing' },
      owned: true,
      mtime: 10,
    },
  ]);

  return (
    <Router>
      <header id="app-header">
        <h1><Link to="/">bananas for books</Link></h1>
        { /* when changing the title above, also change it in index.html and 404.html */ }
      </header>

      <Switch>
        <Route exact path="/">
          <AuthorList books={books} />
        </Route>
        <Route exact path="/author/:id">
          <BookListWithParams books={books} />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
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
  return <main>404 page not found</main>;
}
