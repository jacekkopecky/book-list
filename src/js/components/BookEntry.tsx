import * as React from 'react';

import './BookEntry.css';

import { Book } from '../types';
import * as tools from '../tools/tools';

export default function BookEntry({ book }: { book: Book }): JSX.Element {
  const [expanded, setExpanded] = React.useState(false);

  return expanded
    ? <ExpandedBook book={book} setExpanded={setExpanded} />
    : <CollapsedBook book={book} setExpanded={setExpanded} />;
}

interface BookEntryProps {
  book: Book,
  setExpanded: (val: boolean) => void,
}

function CollapsedBook({ book, setExpanded }: BookEntryProps) : JSX.Element {
  return (
    <div
      className="CollapsedBook"
      onClick={() => setExpanded(true)}
      onKeyPress={() => setExpanded(true)}
      role="menuitem"
      tabIndex={0}
    >
      { book.title }
    </div>
  );
}

function ExpandedBook({ book, setExpanded }: BookEntryProps) : JSX.Element {
  return (
    <div
      className="ExpandedBook"
      onClick={() => setExpanded(true)}
      onKeyPress={() => setExpanded(true)}
      role="menuitem"
      tabIndex={0}
    >
      <div className="title">{ book.title }</div>
      { book.series && (
        <div className="series">
          Series: { book.series }
        </div>
      ) }
      { book.author ? (
        <div className="author">
          Author: { tools.authorName(book.author) }
        </div>
      ) : (
        <div className="author unknown">
          Author unknown
        </div>
      ) }
      { book.notes ? (
        <div className="notes">
          Notes: { book.notes }
        </div>
      ) : (
        <div className="notes none">
          No notes.
        </div>
      ) }
      <div className="mtime">Last updated { tools.formatMTime(book.mtime) }</div>

      <button type="button">edit</button>
      { book.owned ? (
        <button type="button">I no longer have it</button>
      ) : (
        <button type="button">I have it now</button>
      ) }

      <CloseButton onClick={() => setExpanded(false)} />
    </div>
  );
}

function CloseButton({ onClick } : { onClick: () => void }): JSX.Element {
  return (
    <div
      className="CloseButton"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onKeyPress={(e) => { e.stopPropagation(); onClick(); }}
      role="button"
      tabIndex={0}
    >
      ×
    </div>
  );
}
