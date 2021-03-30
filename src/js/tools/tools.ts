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
