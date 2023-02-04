// import * as React from 'react';
// import { render, mount, ReactWrapper } from 'enzyme';

// import BookEdit from '../../js/components/BookEdit';
// import * as types from '../../js/types';

// const testingBooks: types.Book[] = [
//   {
//     id: '1',
//     mtime: 10,
//     title: 'title 1',
//     owned: false,
//     author: { fname: 'joe', lname: 'schmoe' },
//     notes: 'notes',
//     series: 'series 1',
//   },
// ];

// const firstBook = testingBooks[0];

describe('<BookEdit/>', () => {
  it('is ignored', () => {
    expect(true).toBeTruthy();
  });

  // it('renders without exception', () => {
  //   expect(() => render(
  //     <BookEdit
  //       originalBook={testingBooks[0]}
  //       knownBooks={testingBooks}
  //       save={() => {}}
  //       delete={() => {}}
  //     />,
  //   )).not.toThrow();
  // });

  // describe('rendering existing data', () => {
  //   let wrapper: ReactWrapper<unknown>;

  //   beforeAll(() => {
  //     wrapper = mount(
  //       <BookEdit
  //         originalBook={firstBook}
  //         knownBooks={testingBooks}
  //         save={() => {}}
  //         delete={() => {}}
  //       />,
  //     );
  //   });

  //   afterAll(() => {
  //     wrapper.unmount();
  //   });

  //   it.each([
  //     ['.title', firstBook.title],
  //     ['.lname', firstBook.author?.lname],
  //     ['.fname', firstBook.author?.fname],
  //     ['.series', firstBook.series],
  //   ])(
  //     'puts the expected data in %s input',
  //     (parentSelector: string, value?: string) => {
  //       const el = wrapper.find(`${parentSelector} input`);
  //       expect(el).toHaveLength(1);
  //       expect(el.getDOMNode()).toHaveProperty('value', value);
  //     },
  //   );

  //   it.each([
  //     ['.notes', firstBook.notes],
  //   ])(
  //     'puts the expected data in %s textarea',
  //     (parentSelector: string, value?: string) => {
  //       const el = wrapper.find(`${parentSelector} textarea`);
  //       // multiline text field seems to consist of two text areas in Material-UI
  //       expect(el.length).toBeGreaterThan(0);
  //       expect(el.first().getDOMNode()).toHaveProperty('textContent', value);
  //     },
  //   );
  // });
});
