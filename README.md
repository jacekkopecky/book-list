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

* use id not title etc. for book key where available
* search functionality
* editing functionality
   - autocomplete/autosuggest matches for author / series
   - maybe drop-down of alphabetical list for author / series
* service worker for offline work, background sync
* check when adding a book that its title isn't already there
* better mobile interface
   - swipe book to change status or to edit
   - swipe between author and series view
* desktop interface with more columns of lists
* add dark mode (see https://material-ui.com/customization/palette/#dark-mode )
* show books that are in the bin, empty bin
* after save could go forward not back in history (see todo in BookEdit.tsx)
* top-level menu, about, version

* resolved:
   - problem: books listed by author are not listed in order they should be read
   - solution: add first line of notes in collapsed book entry

## API

See [`docs/API.md`](docs/API.md) for documentation of the API.
