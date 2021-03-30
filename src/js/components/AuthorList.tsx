import * as React from 'react';
import { Link } from 'react-router-dom';

import { Author, Book } from '../types';
import * as tools from '../tools/tools';

export default function AuthorList({ books }: { books: Book[] }): JSX.Element {
  const authors = new Map<string, Author | undefined>();
  for (const book of books) {
    authors.set(tools.authorKey(book.author), book.author);
  }

  const sorted = Array.from(authors.keys()).sort();

  return (
    <ul className="AuthorList">
      { sorted.map((x) => renderAuthor(x)) }
    </ul>
  );

  function renderAuthor(key: string) {
    const author = authors.get(key) ?? tools.UNKNOWN;
    return <AuthorItem key={key} id={tools.authorPath(author)} author={author} />;
  }
}

function AuthorItem({ id, author } : { id: string, author: Author }): JSX.Element {
  return <li><Link to={`/author/${id}`}>{ author.fname } { author.lname }</Link></li>;
}
