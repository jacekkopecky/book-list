// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore({ namespace: 'v1' });

const BOOKS_KIND = 'Books';
const BIN_KIND = 'Bin';
const IDS_KEY = datastore.key([BOOKS_KIND]);

// returns {
//   books: [ …books ],
//   bin: [ …books ],
// }
exports.listBooks = async (user) => {
  const result = {
    books: await getBooksForUser(user, datastore),
    bin: await getBinForUser(user, datastore),
  };

  return result;
};

// returns the book with id and mtime
exports.addBook = async (user, newBook) => {
  const tx = datastore.transaction();
  try {
    await tx.run();
    const books = await getBooksForUser(user, tx);
    const id = (await tx.allocateIds(IDS_KEY, 1))[0][0].id;

    newBook.id = id;
    newBook.mtime = Date.now();
    books.push(newBook);

    await saveBooksForUser(user, books, tx);
    await tx.commit();
    return newBook;
  } catch (e) {
    await tx.rollback();
    console.error('error adding book');
    console.error(e);
  }
};

// returns the updated book or null if book not found
exports.updateBook = async (user, book) => {
  const tx = datastore.transaction();
  try {
    await tx.run();
    const books = await getBooksForUser(user, tx);

    const oldBookIndex = books.findIndex((b) => b.id === book.id);
    if (oldBookIndex === -1) {
      await tx.rollback();
      return null;
    }

    book.mtime = Date.now();
    books[oldBookIndex] = book;

    await saveBooksForUser(user, books, tx);
    await tx.commit();
    return book;
  } catch (e) {
    await tx.rollback();
    console.error('error updating book', e);
    throw new Error('error updating book');
  }
};

// returns true or false, true means the book was found and binned
exports.moveBookToBin = async (user, id) => {
  const tx = datastore.transaction();
  try {
    await tx.run();
    const books = await getBooksForUser(user, tx);
    const bin = await getBinForUser(user, tx);

    const oldBookIndex = books.findIndex((b) => b.id === id);
    if (oldBookIndex === -1) {
      await tx.rollback();
      return false;
    }

    // remove the book from the list
    const [book] = books.splice(oldBookIndex, 1);

    // add it to the bin
    // books in the bin don't have IDs
    delete book.id;
    book.mtime = Date.now();
    bin.push(book);

    await saveBooksForUser(user, books, tx);
    await saveBinForUser(user, books, tx);
    await tx.commit();
    return true;
  } catch (e) {
    await tx.rollback();
    console.error('error updating book', e);
    throw new Error('error updating book');
  }
};

exports.getBin = (user) => getBinForUser(user, datastore);

// helper functions for datastore access

async function getBooksForUser(user, tx) {
  const booksKey = datastore.key([BOOKS_KIND, user]);
  const books = await tx.get(booksKey);

  if (books[0]) {
    return JSON.parse(books[0].json);
  } else {
    return [];
  }
}

async function getBinForUser(user, tx) {
  const booksKey = datastore.key([BIN_KIND, user]);
  const books = await tx.get(booksKey);

  if (books[0]) {
    return JSON.parse(books[0].json);
  } else {
    return [];
  }
}

async function saveBooksForUser(user, books, tx) {
  const booksKey = datastore.key([BOOKS_KIND, user]);
  const entity = {
    key: booksKey,
    excludeLargeProperties: true,
    excludeFromIndexes: ['json'],
    data: { json: JSON.stringify(books) },
  };

  await tx.save(entity);
}

async function saveBinForUser(user, books, tx) {
  const booksKey = datastore.key([BIN_KIND, user]);
  const entity = {
    key: booksKey,
    excludeLargeProperties: true,
    excludeFromIndexes: ['json'],
    data: { json: JSON.stringify(books) },
  };

  await tx.save(entity);
}
