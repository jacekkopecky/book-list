import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import {
  Button, CircularProgress, Menu, MenuItem, Tooltip,
} from '@material-ui/core';
import { ErrorOutline, AccountCircle } from '@material-ui/icons';

import { AppState } from '../types';

import './Login.css';

interface StateSetter {
  (state: AppState.loggedIn, email: string): void,
  (state: Exclude<AppState, AppState.loggedIn>): void,
}

interface LoginProps {
  state: AppState,
  setState: StateSetter,
}

export default function Login({ state, setState }: LoginProps): JSX.Element {
  const {
    loginWithRedirect, logout, isAuthenticated, user, isLoading,
  } = useAuth0();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  React.useEffect(() => {
    // todo this isn't great, we shouldn't have state redundant to useAuth
    if (!isLoading && isAuthenticated && state === AppState.starting && user?.email) {
      setState(AppState.loggedIn, user.email);
    }
  });

  const doLogout = () => {
    closeMenu();
    logout();
    setState(AppState.loggedOut);
  };

  let mainEl: JSX.Element;
  switch (state) {
    case AppState.starting:
    case AppState.loggedOut:
      mainEl = (
        <Button color="inherit" onClick={openMenu}>
          Login
        </Button>
      );
      break;
    case AppState.loggedIn:
    case AppState.progress:
    case AppState.connected:
      mainEl = (
        <Button title="account" color="inherit" onClick={openMenu}>
          { user?.name && `${user.name}\u00a0` }
          { user?.picture ? (
            <img className="user-icon" src={user.picture} alt="user avatar" />
          ) : (
            <AccountCircle />
          ) }
        </Button>
      );
      break;
    case AppState.error:
    default:
      mainEl = (
        <Tooltip title="log-in or connection error, try again later">
          <ErrorOutline />
        </Tooltip>
      );
  }

  if (isLoading) {
    return (
      <Tooltip title="logging in">
        <CircularProgress color="inherit" size="2em" />
      </Tooltip>
    );
  }

  return (
    <>
      { mainEl }
      <Menu
        id="simple-menu"
        anchorEl={menuAnchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={closeMenu}
      >
        { isAuthenticated && user?.name && <MenuItem disabled>{ user.name }</MenuItem> }
        { !isAuthenticated && (<MenuItem onClick={() => loginWithRedirect()}>Log in</MenuItem>) }
        { isAuthenticated && <MenuItem onClick={doLogout}>Log out</MenuItem> }
        { isAuthenticated && (
          <MenuItem onClick={() => { window.location.href = '/admin'; }}>Admin</MenuItem>
        ) }
        <MenuItem onClick={() => { window.location.href = '/version.txt'; }}>Version</MenuItem>
      </Menu>
    </>
  );
}
