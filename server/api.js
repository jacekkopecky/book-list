const express = require('express');
const webPush = require('web-push');

const config = require('./config');
const db = require('./db');
const auth = require('./auth');

const api = express.Router();
module.exports = api;

let useWebPush = false;

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    config.website,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
  useWebPush = true;
  console.log('using webPush');
} else {
  console.log('not using webPush');
}

api.get('/books', asyncWrap(retrieveBooks));
api.post('/books', express.json(), asyncWrap(addBook));
api.put('/books/:id', express.json(), asyncWrap(updateBook));
api.delete('/books/:id', express.json(), asyncWrap(moveBookToBin));

// push notifications
api.post('/push/register', express.json({ limit: 4096 }), asyncWrap(registerForPush));
api.get('/push/vapid-public-key', sendVapidKey);

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
  const user = auth.getUserEmail(req);
  res.json(await db.listBooks(user));
}

async function addBook(req, res) {
  const user = auth.getUserEmail(req);
  const validatedNewBook = validateNewBook(req.body);
  if (!validatedNewBook) {
    res.sendStatus(400);
    return;
  }

  res.json(await db.addBook(user, validatedNewBook));
}

async function updateBook(req, res) {
  const user = auth.getUserEmail(req);
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
  const user = auth.getUserEmail(req);
  const moved = await db.moveBookToBin(user, req.params.id);
  if (moved) {
    res.json(await db.getBin(user));
  } else {
    res.sendStatus(409);
  }
}

async function registerForPush(req, res) {
  if (!useWebPush) {
    res.sendStatus(202);
    return;
  }

  const user = auth.getUserEmail(req);
  const subscription = req.body;
  if (!subscription) {
    res.sendStatus(400);
    return;
  }

  await db.addSubscription(user, subscription);
  res.sendStatus(204);
}

function sendVapidKey(req, res) {
  res.send(useWebPush ? process.env.VAPID_PUBLIC_KEY : 'none');
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
