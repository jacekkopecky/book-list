import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Author, Book, NewBook } from '../types';

export const UNKNOWN: Author = {
  fname: 'unknown',
  lname: 'author',
};

export function authorKey(author?: Author): string | null {
  if (!author) return null;
  return `${author.lname}#${author.fname}`;
}

export function authorPath(author: Author = UNKNOWN): string {
  return valuePath(authorName(author));
}

export function valuePath(series: string): string {
  return encodeURIComponent(series.replace(/\s/g, '-'));
}

export function authorName(author: Author = UNKNOWN): string {
  return `${author.fname} ${author.lname}`;
}

export function formatMTime(mtime: number): string {
  const rtf = new Intl.RelativeTimeFormat('en');
  const seconds = (Date.now() - mtime) / 1000;

  if (seconds < 60) return 'a moment ago';

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (hours < 60) return rtf.format(-hours, 'hour');

  const days = Math.round(hours / 24);
  if (days < 31) return rtf.format(-days, 'day');

  const months = Math.round(days / 30.44);
  if (months < 12) return rtf.format(-months, 'month');

  return rtf.format(-Math.round(months / 12), 'year');
}

// useQuery adopted from https://reactrouter.com/web/example/query-parameters
export function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

export function useShowingOwned(): [boolean, (value: boolean) => void] {
  const navigate = useNavigate();

  const showingOwned = useQuery().has('owned');

  const setShowingOwned = (value: boolean) => {
    navigate(value ? '?owned' : '?', { replace: true });
  };

  return [showingOwned, setShowingOwned];
}

/*
 * useLocalStorage hook from https://usehooks.com/useLocalStorage/ 2020-09-13
 *
 * extended to add deleteValue() (does not affect the state)
 * extended to detect stale state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  migration?: (data: unknown) => T,
): [T, (t: T) => void, () => void] {
  const getCurrentValue = () => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      if (!item) return initialValue;

      // Parse stored json and possibly migrate
      let parsed: unknown = JSON.parse(item);
      if (migration) parsed = migration(parsed);
      return parsed as T;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = React.useState(getCurrentValue);

  // remember the key so we can find out when state gets stale
  const [storedKey, setStoredKey] = React.useState(key);

  if (storedKey !== key) {
    const currentRaw = window.localStorage.getItem(key);
    if (JSON.stringify(storedValue) !== currentRaw) {
      setStoredValue(getCurrentValue());
    }
    setStoredKey(key);
  }

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((t: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage (remove if)
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  const deleteValue = () => {
    window.localStorage.removeItem(key);
  };

  return [storedValue, setValue, deleteValue];
}

// remove empty-string values, and the whole author if both values are empty
// also trim string values
export function removeEmpties(book: NewBook): NewBook;
export function removeEmpties(book: Book): Book;
export function removeEmpties(book: NewBook | Book): NewBook | Book {
  const newBook = { ...book };

  newBook.title = newBook.title.trim();

  if (newBook.author) {
    newBook.author.fname = newBook.author.fname.trim();
    newBook.author.lname = newBook.author.lname.trim();

    if (!newBook.author.fname && !newBook.author.lname) {
      delete newBook.author;
    }
  }

  newBook.series = newBook.series?.trim();
  newBook.notes = newBook.notes?.trim();

  if (!newBook.series) delete newBook.series;
  if (!newBook.notes) delete newBook.notes;

  return newBook;
}

// compare strings with the default locale, ignore case and accents, sort empty at the end
export function localeCompare(a: string | null, b: string | null): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a.localeCompare(b, undefined, { sensitivity: 'base' });
}
