import * as React from 'react';

import './BookListByAuthor.css';

import { Book } from '../types';
import * as tools from '../tools/tools';

import BookEntry from './BookEntry';
import MainHeading from './MainHeading';

interface BookListProps {
  books: Book[],
  authorPath: string,
}

interface Series {
  title: string,
  books: Book[],
}

type BookOrSeries = Book | Series;

export default function BookListByAuthor({ books, authorPath }: BookListProps): JSX.Element {
  const booksByAuthor = books.filter(
    (b) => tools.authorPath(b.author) === authorPath,
  );

  // todo add series to books
  const series = findSeries(booksByAuthor);

  const entries = [...booksByAuthor, ...series];

  entries.sort((a, b) => a.title.localeCompare(b.title));

  const firstBook = booksByAuthor[0];
  if (!firstBook) {
    return <div className="error">empty book list – how did that happen?</div>;
  }

  return (
    <MainHeading title={`Books by ${tools.authorName(firstBook.author)}`}>
      <ul>
        { entries.map(renderBookOrSeries) }
      </ul>
    </MainHeading>
  );
}

function renderBookOrSeries(x: BookOrSeries) {
  if (isBook(x)) {
    return renderBook(x);
  } else {
    return renderSeries(x);
  }
}

function renderBook(book: Book, extraClass?: string) {
  return <li key={book.title} className={extraClass}><BookEntry book={book} /></li>;
}

function renderSeries(series: Series) {
  series.books.sort((a, b) => a.title.localeCompare(b.title));
  return [
    <li key={`${series.title} (series)`}>{ series.title } (series)</li>,
    ...series.books.map((x) => renderBook(x, 'inSeries')),
  ];
}

function isBook(x: BookOrSeries) : x is Book {
  return 'id' in x && x.id != null;
}

function findSeries(books: Book[]): Series[] {
  const seriesMap = new Map<string, Series>();
  for (const book of books) {
    if (book.series) {
      let series = seriesMap.get(book.series);
      if (!series) {
        series = {
          title: book.series,
          books: [],
        };
        seriesMap.set(book.series, series);
      }
      series.books.push(book);
    }
  }

  return Array.from(seriesMap.values());
}
