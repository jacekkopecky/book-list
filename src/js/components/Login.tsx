import * as React from 'react';

import {
  Button, CircularProgress, IconButton, Menu, MenuItem, Tooltip,
} from '@material-ui/core';
import { ErrorOutline, AccountCircle } from '@material-ui/icons';

import { AppState } from '../types';

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
  const [name] = React.useState('');

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const logout = () => {
    closeMenu();
    try {
      setState(AppState.loggedOut);
    } catch (e) {
      console.error('error logging out', e);
      setState(AppState.error);
    }
  };

  React.useEffect(() => {
    void (() => {
      try {
        // log in somehow
        setState(AppState.loggedIn, 'jackopecky@gmail.com');
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
        <IconButton title="account" color="inherit" onClick={openMenu}>
          <AccountCircle />
        </IconButton>
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
        <MenuItem onClick={closeMenu}>
          <div id="LoginGoogleButton" />
        </MenuItem>
        { state !== AppState.loggedOut && name && <MenuItem disabled>{ name }</MenuItem> }
        <MenuItem onClick={logout}>Logout</MenuItem>
        <MenuItem
          onClick={() => {
            window.location.href = '/version.txt';
          }}
        >
          Version
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.location.href = '/admin';
          }}
        >
          Admin
        </MenuItem>
      </Menu>
    </>
  );
}

declare global {
  interface Window {
    googleAuthInit: () => void,
  }
}
