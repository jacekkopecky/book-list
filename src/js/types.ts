export interface Author {
  fname: string,
  lname: string,
}
export interface Book {
  id: unknown,
  title: string,
  author?: Author,
  series?: string,
  owned: boolean,
  notes?: string,
  mtime: number,
}
