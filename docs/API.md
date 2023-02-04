# API

The API v2 is simply a collection of books:

* `GET` on `/books` – retrieve all the known books
   - returns an object with
      - `books` – an array of books
      – `bin` – an array of books that have been deleted and can be restored
* `POST` on `/books` – add a new book
* `PUT` on `/books/:id` – edit a book
* `DELETE` on `/books/:id` – move the book to the bin, returns bin

Version v2 differs from v1 only in that it switched authentication from Google to Auth0.

## Book Record Structure

A *book* is structured like this:

```typescript
interface Author {
  fname: string,
  lname: string,
}

interface Book {
  id: unknown,
  title: string,
  author?: Author,
  series?: string,
  owned: boolean,
  notes?: string,
  mtime: number,
}
```
