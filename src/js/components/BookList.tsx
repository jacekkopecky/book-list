import * as React from 'react';

import './BookList.css';

import { Book } from '../types';
import * as tools from '../tools/tools';

interface BookListProps {
  books: Book[],
  authorPath: string,
}

interface Series {
  title: string,
  books: Book[],
}

type BookOrSeries = Book | Series;

export default function BookList({ books, authorPath }: BookListProps): JSX.Element {
  const booksByAuthor = books.filter(
    (b) => tools.authorPath(b.author) === authorPath,
  );

  // todo add series to books
  const series = findSeries(booksByAuthor);

  const entries = [...booksByAuthor, ...series];

  entries.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="BookList">
      <h2>Books by { tools.authorName(booksByAuthor[0].author) }</h2>
      <ul>
        { entries.map(renderBookOrSeries) }
      </ul>
    </main>
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
  return <li key={book.title} className={extraClass}>{ book.title }</li>;
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
