import { Author } from '../types';

export const UNKNOWN: Author = {
  fname: 'unknown',
  lname: 'author',
};

export function authorKey(author: Author = UNKNOWN): string {
  return `${author.lname}#${author.fname}`;
}

export function authorPath(author: Author = UNKNOWN): string {
  return authorName(author).replace(/\s/g, '-');
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
