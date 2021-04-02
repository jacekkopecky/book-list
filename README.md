# Book List

A little program for keeping track of the books you have and want.

The main use case: the user (let's use the name Jo) is in a charity shop and finds an interesting book. Jo is not sure if they own the book already, or if they read it a long time ago (maybe from a library). Jo will buy the book but doesn't want to have it twice – to prevent having two copies, Jo checks the app.

A book has these properties:

* title
* author (possibly omitted if unknown)
* series (if the book is part of a series)
* notes (anything the user might want to add for themself)
* whether the user owns or wants the book

## todo

* add functionality
   - in main list
   - in list by author (pre-fills author)
   - in list by series (pre-fills series, also author if all books in the series are by the same author)
   - autocomplete/autosuggest matches for author / series
   - maybe drop-down of alphabetical list for author / series
* deleting a book
* google auth
* server with a database
* search functionality
* service worker for offline work, background sync
* better mobile interface
   - swipe book to change status
   - swipe between author and series view
* desktop interface
* a book in a book list should show the first two lines of the notes
* there should be a listing of series, not just books
   - list of books in series should show author at top (if all books by same author) or by each book

## API

See [`docs/API.md`](docs/API.md) for documentation of the API.
