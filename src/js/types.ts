export interface Author {
  fname: string,
  lname: string,
}

export interface NewBook {
  title: string,
  author?: Author,
  series?: string,
  owned: boolean,
  notes?: string,
}

export interface Book extends NewBook {
  id: string,
  mtime: number,
}

export interface BookStats {
  bookCount: number,
  owned: number,
}

export enum AppState {
  starting,
  loggedOut,
  loggedIn,
  connected,
  progress,
  offline,
  error,
}

export type SetOwnedCallback = (book: Book, owned: boolean) => void;
export type SaveBookCallback = (book: Book) => void;
export type DeleteBookCallback = (book: Book) => void;
export type AddBookCallback = (book: NewBook) => void;
export type AddBookTrigger = (book?: Partial<NewBook>) => void;
