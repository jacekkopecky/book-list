import * as React from 'react';

import {
  Container, List, ListItem, ListItemText, Typography,
} from '@material-ui/core';

import { containerProps } from './theme';

import { BookStats } from '../types';

import EmptyListItem from './EmptyListItem';

import { useApi } from '../tools/api';

import './Admin.css';

enum State {
  loading,
  loaded,
  error,
  notAdmin,
}

export default function Admin(): JSX.Element {
  const [emailList, setEmailList] = React.useState<string[]>([]);
  const [state, setState] = React.useState(State.loading);
  const api = useApi();

  React.useEffect(() => {
    (async () => {
      const list = await api.adminListEmails();
      if (list != null) {
        setEmailList(list);
        setState(State.loaded);
      } else {
        setState(State.notAdmin);
      }
    })().catch((e) => {
      console.error(e);
      setState(State.error);
    });
  }, []);

  let body;
  switch (state) {
    case State.loading:
      body = <Message text="loading" />;
      break;
    case State.error:
      body = <Message text="error" />;
      break;
    case State.notAdmin:
      body = <Message text="you are not admin" />;
      break;
    case State.loaded:
      body = (
        <>
          <Typography variant="h5">Users:</Typography>
          <List>{ renderEmailList(emailList) }</List>
        </>
      );
      break;
  }

  return (
    <Container {...containerProps} className="Admin">
      { body }
    </Container>
  );
}

function renderEmailList(list: string[]): JSX.Element | JSX.Element[] {
  if (list.length === 0) {
    return <EmptyListItem text="none" />;
  } else {
    return list.map((s) => <UserEntry key={s} email={s} />);
  }
}

function Message({ text }: { text: string }): JSX.Element {
  return <Typography>{ text }</Typography>;
}

function UserEntry({ email }: { email: string }) {
  const [bookStats, setBookStats] = React.useState<'load' | 'err' | BookStats>();
  const api = useApi();

  let booksCount;
  if (bookStats === 'load') {
    booksCount = 'loading book count…';
  } else if (bookStats === 'err') {
    booksCount = 'error: could not load book count';
  } else if (typeof bookStats === 'object') {
    const wanted = bookStats.bookCount - bookStats.owned;
    booksCount = `${wanted} wanted book(s), ${bookStats.bookCount} total`;
  }

  return (
    <ListItem onClick={loadNumberOfBooks}>
      <ListItemText primary={email} secondary={booksCount} />
    </ListItem>
  );

  async function loadNumberOfBooks() {
    setBookStats('load');
    try {
      const number = await api.adminLoadBookStats(email);
      setBookStats(number);
    } catch (e) {
      console.error(e);
      setBookStats('err');
    }
  }
}
