import * as React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
} from 'react-router-dom';

import './App.css';

export default function App(): JSX.Element {
  return (
    <Router>
      <header id="app-header">
        <h1><Link to="/">bananas for books</Link></h1>
        { /* when changing the title above, also change it in index.html and 404.html */ }
      </header>

      <Switch>
        <Route exact path="/">
          <p>hi</p>
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

function NotFound() {
  return <main>404 page not found</main>;
}
