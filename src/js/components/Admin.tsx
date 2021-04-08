import * as React from 'react';

import * as api from '../tools/api';

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

  switch (state) {
    case State.loading: return <div>loading</div>;
    case State.error: return <div>error</div>;
    case State.notAdmin: return <div>you are not admin</div>;
    case State.loaded: return (
      <div>Users:
        <ol>
          { emailList.length === 0 ? 'none' : emailList.map((s) => <li key={s}>{ s }</li>) }
        </ol>
      </div>
    );
  }
}
