import * as React from 'react';

import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { containerProps } from './theme';

import EmptyListItem from './EmptyListItem';

import * as api from '../tools/api';

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
    case State.loading: body = <Message text="loading" />; break;
    case State.error: body = <Message text="error" />; break;
    case State.notAdmin: body = <Message text="you are not admin" />; break;
    case State.loaded:
      body = (
        <>
          <Typography variant="h5">Users:</Typography>
          <List>
            { renderEmailList(emailList) }
          </List>
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
  return (
    <ListItem>
      <ListItemText
        primary={email}
      />
    </ListItem>
  );
}
