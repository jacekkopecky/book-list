import * as React from 'react';
import { useHistory } from 'react-router-dom';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';

import MainHeading from './MainHeading';

import {
  Book,
  NewBook,
  SaveBookCallback,
  DeleteBookCallback,
  AddBookCallback,
} from '../types';

import * as tools from '../tools/tools';

import './BookEdit.css';

// we have to have either save and a book or add and a partial new book, but not both
interface BookEditProps {
  originalBook: Book,
  knownBooks: Book[],
  save: SaveBookCallback,
  delete: DeleteBookCallback,
  add?: undefined,
}

interface BookAddProps {
  originalBook: Partial<NewBook>,
  knownBooks: Book[],
  save?: undefined,
  add: AddBookCallback,
}

export default function BookEdit(props: BookEditProps | BookAddProps): JSX.Element {
  const history = useHistory();

  // clone the book for changing
  // we use an empty author so it's easier to handle, and we remove it when saving
  const [book, setBook] = React.useState(() => ({ author: { fname: '', lname: '' }, ...props.originalBook }));

  const setAuthorFname = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newBook = { ...book };
    newBook.author.fname = e.target.value;
    setBook(newBook);
  };

  const setAuthorLname = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newBook = { ...book };
    newBook.author.lname = e.target.value;
    setBook(newBook);
  };

  const doSave = () => {
    if (!verifyNewBook(book)) return;

    const bookForSaving = tools.removeEmpties(book);

    if (props.save) {
      if (!verifyBook(bookForSaving)) return;
      props.save(bookForSaving);
    } else {
      props.add(bookForSaving);
    }
    history.goBack();
    // todo could go forward instead (then browser back will return to editing)
    // but if we don't have an ID, we need to get it from props.add() and first history.replace
    // as if we were editing that book all along
    // going forward would go to the list of books by the same author,
    // owned or not depending on the book
  };

  const doDelete = () => {
    if (!props.save) return; // delete shouldn't be called on a new book

    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure to delete “${props.originalBook.title}”?`)) {
      props.delete(props.originalBook);
      history.goBack();
    }
  };

  const doCancel = () => {
    history.goBack();
  };

  const title = props.save ? `Editing ${props.originalBook.title}` : 'Adding a new book';

  return (
    <MainHeading
      title={title}
    >
      <Typography component="div" className="BookEdit">
        <Grid container spacing={1}>
          <Grid item xs={6} />
          <Grid item xs={6}>
            <Grid component="label" container alignItems="center" justify="flex-end" spacing={1}>
              <Grid item>Want it</Grid>
              <Grid item>
                <Switch
                  checked={book.owned ?? false}
                  color="primary"
                  onChange={(e) => setBook({ ...book, owned: e.target.checked })}
                />
              </Grid>
              <Grid item>Have it</Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Title"
              margin="normal"
              required
              fullWidth
              autoFocus
              value={book.title ?? ''}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={5}>
            <Autocomplete
              freeSolo
              options={unique(props.knownBooks.map((b) => b.author?.fname))}
              value={book.author.fname ?? ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Author"
                  margin="normal"
                  fullWidth
                  helperText="first name"
                  onChange={setAuthorFname}
                />
              )}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              options={unique(props.knownBooks.map((b) => b.author?.lname))}
              value={book.author.lname ?? ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label=" "
                  margin="normal"
                  fullWidth
                  helperText="last name"
                  onChange={setAuthorLname}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={unique(props.knownBooks.map((b) => b.series))}
              value={book.series ?? ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Series"
                  margin="normal"
                  placeholder="optional"
                  fullWidth
                  onChange={(e) => setBook({ ...book, series: e.target.value })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              multiline
              margin="normal"
              placeholder="optional"
              fullWidth
              value={book.notes ?? ''}
              onChange={(e) => setBook({ ...book, notes: e.target.value })}
            />
          </Grid>
        </Grid>
        <Grid container alignContent="flex-end" className="bottom">
          <Grid item container xs={6} justify="flex-start">
            { props.save ? (
              <Button
                className="delete"
                color="secondary"
                variant="contained"
                onClick={doDelete}
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={doCancel}
              >
                Cancel
              </Button>
            ) }
          </Grid>
          <Grid item container xs={6} justify="flex-end">
            <Button
              color="primary"
              variant="contained"
              disabled={!verifyNewBook(book)}
              onClick={doSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Typography>
    </MainHeading>
  );
}

function verifyBook(book: NewBook): book is Book {
  return 'id' in book;
}

function verifyNewBook(book: Partial<Book>): book is NewBook {
  return Boolean(book.title?.trim()) && verifyAuthor(book);
}

function verifyAuthor(book: Partial<Book>): boolean {
  if (!book.author) return true;

  const fname = Boolean(book.author.fname.trim());
  const lname = Boolean(book.author.lname.trim());

  // either both are there or both are empty
  return (fname && lname) || (!fname && !lname);
}

function unique(arr: Iterable<string | undefined>): string[] {
  const set = new Set(arr);
  set.delete(undefined);

  // now the set does not have any undefined
  return Array.from((set as Set<string>).keys()).sort(tools.localeCompare);
}
