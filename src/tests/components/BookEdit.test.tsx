import * as React from 'react';
import { render, screen, getByRole } from '@testing-library/react';

import { MemoryRouter } from 'react-router';
import BookEdit from '../../js/components/BookEdit';
import * as types from '../../js/types';

const testingBooks: types.Book[] = [
  {
    id: '1',
    mtime: 10,
    title: 'title 1',
    owned: false,
    author: { fname: 'joe', lname: 'schmoe' },
    notes: 'notes go here',
    series: 'series 1',
  },
];

const firstBook = testingBooks[0];

function myRender(el: JSX.Element) {
  return render(el, { wrapper: MemoryRouter });
}

describe('<BookEdit/>', () => {
  beforeEach(() => {
    myRender(<BookEdit
      originalBook={firstBook}
      knownBooks={testingBooks}
      save={() => {}}
      delete={() => {}}
    />);
  });

  it('renders', () => {
    expect(screen.getByText('Editing title 1')).toBeVisible();
  });

  describe('rendering existing data', () => {
    it.each([
      ['title', 'textbox', firstBook.title],
      ['lname', 'combobox', firstBook.author?.lname],
      ['fname', 'combobox', firstBook.author?.fname],
      ['series', 'combobox', firstBook.series],
      ['notes', 'textbox', firstBook.notes],
    ])(
      'puts the expected data in %s input',
      (testid: string, role: string, value?: string) => {
        const el = screen.getByTestId(testid);
        expect(el).toBeVisible();
        expect(getByRole(el, role)).toHaveValue(value);
      },
    );
  });
});
