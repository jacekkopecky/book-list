import { Author, Book, NewBook } from '../types';

import config from '../../../server/config';

function apiRequest(path: string, options?: RequestInit): Promise<Response> {
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  return fetch(config.serverURL + path, {
    method: 'GET',
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${idToken}`,
    },
  });
}

export async function loadBooks(): Promise<BooksAndBin> {
  const response = await apiRequest('books');
  if (response.ok) {
    const data: unknown = await response.json();

    if (validateBooksAndBin(data)) {
      return data;
    } else {
      console.error('invalid book array', data);
      throw new Error('received invalid array of books');
    }
  } else {
    console.error(response);
    throw new Error('could not load books');
  }
}

export async function submitNewBook(book: NewBook): Promise<Book> {
  const response = await apiRequest('books', {
    method: 'POST',
    body: JSON.stringify(book),
    headers: {
      'Content-type': 'application/json',
    },
  });

  if (response.ok) {
    const data: unknown = await response.json();

    if (validateBook(data)) {
      return data;
    } else {
      console.error('invalid book', data);
      throw new Error('received invalid book');
    }
  } else {
    console.error(response);
    throw new Error('could not save new book');
  }
}

export async function saveBook(book: Book): Promise<Book> {
  const response = await apiRequest(`books/${book.id}`, {
    method: 'PUT',
    body: JSON.stringify(book),
    headers: {
      'Content-type': 'application/json',
    },
  });

  if (response.ok) {
    const data: unknown = await response.json();

    if (validateBook(data)) {
      return data;
    } else {
      console.error('invalid book', data);
      throw new Error('received invalid book');
    }
  } else {
    console.error(response);
    throw new Error('could not save book');
  }
}

export async function deleteBook(book: Book): Promise<Book[]> {
  const response = await apiRequest(`books/${book.id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    const data: unknown = await response.json();

    if (validateBookArray(data)) {
      return data;
    } else {
      console.error('invalid book', data);
      throw new Error('received invalid bin');
    }
  } else {
    console.error(response);
    throw new Error('could not delete book');
  }
}

// returns a list of users, or null if the caller is not admin
export async function adminListEmails(): Promise<string[] | null> {
  const response = await apiRequest('admin/users');
  if (response.ok) {
    const data: unknown = await response.json();
    if (Array.isArray(data) && data.every((d) => typeof d === 'string')) {
      return data as string[];
    } else {
      console.error('invalid user list array', data);
      throw new Error('received invalid array of users');
    }
  } else if (response.status === 403) {
    return null;
  } else {
    console.error(response);
    throw new Error('could not load users');
  }
}

// validation functions

type IncomingBook = Partial<Record<keyof Book, unknown>>;
type IncomingAuthor = Partial<Record<keyof Author, unknown>>;

function validateBook(maybeBook?: unknown): maybeBook is Book {
  if (typeof maybeBook !== 'object' || maybeBook == null) return false;

  const book = maybeBook as IncomingBook;

  if (book.id === undefined) return false;
  if (typeof book.title !== 'string') return false;
  if (book.series !== undefined && typeof book.series !== 'string') return false;
  if (book.notes !== undefined && typeof book.notes !== 'string') return false;
  if (typeof book.owned !== 'boolean') return false;
  if (typeof book.mtime !== 'number') return false;

  if (book.author !== undefined) {
    const author = book.author as IncomingAuthor;
    if (typeof author.fname !== 'string') return false;
    if (typeof author.lname !== 'string') return false;
  }

  return true;
}

function validateBookArray(maybeBooks?: unknown): maybeBooks is Book[] {
  if (!Array.isArray(maybeBooks)) return false;

  for (const b of maybeBooks) {
    if (!validateBook(b)) return false;
  }

  return true;
}

interface BooksAndBin {
  books: Book[],
  bin: Book[],
}
type IncomingBooksAndBin = Partial<Record<keyof BooksAndBin, unknown>>;

function validateBooksAndBin(maybeBooksAndBin?: unknown): maybeBooksAndBin is BooksAndBin {
  if (typeof maybeBooksAndBin !== 'object' || maybeBooksAndBin == null) return false;

  const booksAndBin = maybeBooksAndBin as IncomingBooksAndBin;
  if (!validateBookArray(booksAndBin.books)) return false;
  if (!validateBookArray(booksAndBin.bin)) return false;

  return true;
}
