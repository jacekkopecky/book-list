const express = require('express');

const db = require('./db');

const api = express.Router();
module.exports = api;

api.get('/books', asyncWrap(retrieveBooks));
api.post('/books', express.json(), asyncWrap(addBook));
api.put('/books/:id', express.json(), asyncWrap(updateBook));
api.delete('/books/:id', express.json(), asyncWrap(moveBookToBin));

// wrap async function for express.js error handling
function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

/*
 * `GET` on `/books` – retrieve all the known books
 *    - returns an object with
 *       - `books` – an array of books
 *       – `bin` – an array of books that have been deleted and can be restored
 * `POST` on `/books` – add a new book
 * `PUT` on `/books/:id` – edit a book
 * `DELETE` on `/books/:id` – move the book to the bin
 */

async function retrieveBooks(req, res) {
  const user = req.user.emails[0].value;
  res.json(await db.listBooks(user));
}

async function addBook(req, res) {
  const user = req.user.emails[0].value;
  const validatedNewBook = validateNewBook(req.body);
  if (!validatedNewBook) {
    res.sendStatus(400);
    return;
  }

  res.json(await db.addBook(user, validatedNewBook));
}

async function updateBook(req, res) {
  const user = req.user.emails[0].value;
  const validatedBook = validateBook(req.body, req.params.id);
  if (!validatedBook) {
    res.sendStatus(400);
    return;
  }

  const book = await db.updateBook(user, validatedBook);
  if (!book) {
    // book not found
    res.sendStatus(409);
    return;
  }
  res.json(book);
}

async function moveBookToBin(req, res) {
  const user = req.user.emails[0].value;
  const moved = await db.moveBookToBin(user, req.params.id);
  if (moved) {
    res.json(await db.getBin(user));
  } else {
    res.sendStatus(409);
  }
}

// validation functions

function validateNewBook(book) {
  if (typeof book.title !== 'string') return false;
  if (book.series != null && typeof book.series !== 'string') return false;
  if (book.notes != null && typeof book.notes !== 'string') return false;
  if (typeof book.owned !== 'boolean') return false;

  let validatedAuthor;
  if (book.author != null) {
    validatedAuthor = validateAuthor(book.author);
    if (!validatedAuthor) return false;
  }

  const validatedNewBook = {
    title: book.title,
    owned: book.owned,
  };

  if (book.series != null) validatedNewBook.series = book.series;
  if (book.notes != null) validatedNewBook.notes = book.notes;
  if (book.author != null) validatedNewBook.author = validatedAuthor;

  return validatedNewBook;
}

function validateBook(book, id) {
  const validatedNewBook = validateNewBook(book);

  if (!validatedNewBook) return false;

  if (typeof book.id !== 'string') return false;
  if (book.id !== id) return false;
  if (typeof book.mtime !== 'number') return false;

  // add book properties
  validatedNewBook.id = book.id;
  validatedNewBook.mtime = book.mtime;
  return validatedNewBook;
}

function validateAuthor(author) {
  if (typeof author.fname !== 'string') return false;
  if (typeof author.lname !== 'string') return false;

  return {
    fname: author.fname,
    lname: author.lname,
  };
}
