import * as React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { AppState } from '../types';

import config from '../../../server/config';

const auth2Promise = initializeGapi();

interface StateSetter {
  (state: AppState.loggedIn, email: string): void,
  (state: Exclude<AppState, AppState.loggedIn>): void,
}

interface LoginProps {
  state: AppState,
  setState: StateSetter,
}

export default function Login({ state, setState }: LoginProps): JSX.Element {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [name, setName] = React.useState('');

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const onLogin = (user: gapi.auth2.GoogleUser) => {
    closeMenu();
    setName(user.getBasicProfile().getName());
    setState(AppState.loggedIn, user.getBasicProfile().getEmail());
  };

  const logout = async () => {
    closeMenu();
    try {
      await gapi.auth2.getAuthInstance().signOut();
      setState(AppState.loggedOut);
    } catch (e) {
      console.error('error logging out', e);
      setState(AppState.error);
    }
  };

  const error = (reason: unknown) => {
    console.error('failed to initialize Gapi auth2', reason);
    setState(AppState.error);
  };

  React.useEffect(() => {
    void (async () => {
      try {
        await auth2Promise;
        gapi.auth2.init({
          client_id: config.clientId,
        }).then(
          (googleAuth) => {
            // todo
            gapi.signin2.render('LoginGoogleButton', {
              theme: 'light',
              onsuccess: onLogin,
              onfailure: error,
            });

            if (googleAuth.isSignedIn.get()) {
              const email = googleAuth.currentUser.get().getBasicProfile().getEmail();
              setState(AppState.loggedIn, email);
            } else {
              setState(AppState.loggedOut);
            }
          },
          (reason) => {
            console.error('failed to initialize Gapi auth2', reason);
            setState(AppState.error);
          },
        );
      } catch (e) {
        console.error(e);
        setState(AppState.error);
      }
    })();
  }, []);

  let mainEl: JSX.Element;
  switch (state) {
    case AppState.starting:
      mainEl = (
        <Tooltip title="logging in">
          <CircularProgress color="inherit" size="2em" />
        </Tooltip>
      );
      break;
    case AppState.loggedOut:
      mainEl = <Button color="inherit" onClick={openMenu}>Login</Button>;
      break;
    case AppState.loggedIn:
    case AppState.progress:
    case AppState.connected:
      mainEl = (
        <IconButton title="account" color="inherit" onClick={openMenu}>
          <AccountCircleIcon />
        </IconButton>
      );
      break;
    case AppState.error:
    default:
      mainEl = (
        <Tooltip title="log-in or connection error, try again later">
          <ErrorOutlineIcon />
        </Tooltip>
      );
  }

  return (
    <>
      { mainEl }
      <Menu
        id="simple-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}><div id="LoginGoogleButton" /></MenuItem>
        { state === AppState.loggedIn && (
          <MenuItem disabled>{ name }</MenuItem>
        ) }
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
}

declare global {
  interface Window {
    googleAuthInit: () => void,
  }
}

function initializeGapi() {
  return new Promise<void>((resolve, reject) => {
    window.googleAuthInit = () => {
      gapi.load('auth2', () => {
        if (gapi.auth2) resolve();
        else reject(new Error('cannot load auth2'));
      });
    };
    if (window.gapi) window.googleAuthInit();
  });
}
