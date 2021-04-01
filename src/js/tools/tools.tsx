import { useLocation, useHistory } from 'react-router-dom';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme } from '@material-ui/core/styles';

import { Author } from '../types';

export const UNKNOWN: Author = {
  fname: 'unknown',
  lname: 'author',
};

export function authorKey(author: Author = UNKNOWN): string {
  return `${author.lname}#${author.fname}`;
}

export function authorPath(author: Author = UNKNOWN): string {
  return encodeURIComponent(authorName(author).replace(/\s/g, '-'));
}

export function seriesPath(series: string): string {
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

// adopted from https://reactrouter.com/web/example/query-parameters
export function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

export function isNarrow(): boolean {
  return useMediaQuery(
    (theme: Theme) => theme.breakpoints.down('xs'),
    { noSsr: true },
  );
}

export function useShowingOwned(): [boolean, (value: boolean) => void] {
  const history = useHistory();

  const showingOwned = useQuery().has('owned');

  const setShowingOwned = (value: boolean) => {
    history.replace(value ? '?owned' : '?');
  };

  return [showingOwned, setShowingOwned];
}
