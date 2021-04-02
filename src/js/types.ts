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
  id: unknown,
  mtime: number,
}

export type SetOwnedCallback = (book: Book, owned: boolean) => void;
export type SaveBookCallback = (book: Book) => void;
export type AddBookCallback = (book: NewBook) => void;
