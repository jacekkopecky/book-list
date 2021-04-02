import * as React from 'react';
import { useHistory } from 'react-router-dom';

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
  AddBookCallback,
} from '../types';

import './BookEdit.css';

// we have to have either save and a book or add and a partial new book, but not both
interface BookEditProps {
  originalBook: Book,
  save: SaveBookCallback,
  add?: undefined,
}

interface BookAddProps {
  originalBook: Partial<NewBook>,
  save?: undefined,
  add: AddBookCallback,
}

export default function BookEdit(props: BookEditProps | BookAddProps): JSX.Element {
  const { originalBook } = props;

  const history = useHistory();

  // clone the book for changing
  // we use an empty author so it's easier to handle, and we remove it when saving
  const [book, setBook] = React.useState(() => ({ author: { fname: '', lname: '' }, ...originalBook }));

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

    const bookForSaving = removeEmpties(book);

    if (props.save) {
      if (!verifyBook(bookForSaving)) return;
      props.save(bookForSaving);
    } else {
      props.add(bookForSaving);
    }
    history.goBack();
  };

  const title = originalBook.title ? `Editing ${originalBook.title}` : 'Adding a new book';

  return (
    <MainHeading
      title={title}
    >
      <Typography component="div">
        <Grid container className="BookEdit" spacing={1}>
          <Grid item xs={6} />
          <Grid item xs={6}>
            <Grid component="label" container alignItems="center" justify="flex-end" spacing={1}>
              <Grid item>Want it</Grid>
              <Grid item>
                <Switch
                  checked={book.owned}
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
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              label="Author"
              margin="normal"
              fullWidth
              helperText="first name"
              value={book.author.fname}
              onChange={setAuthorFname}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={6}>
            <TextField
              label=" "
              margin="normal"
              fullWidth
              helperText="last name"
              value={book.author.lname}
              onChange={setAuthorLname}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Series"
              margin="normal"
              placeholder="optional"
              fullWidth
              value={book.series}
              onChange={(e) => setBook({ ...book, series: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              multiline
              margin="normal"
              placeholder="optional"
              fullWidth
              value={book.notes}
              onChange={(e) => setBook({ ...book, notes: e.target.value })}
            />
          </Grid>
          <Grid item container xs={12} justify="flex-end">
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

// remove empty-string values, and the whole author if both values are empty
function removeEmpties(book: NewBook) {
  const newBook = { ...book };
  if (newBook.author) {
    if (!newBook.author.fname.trim() && !newBook.author.lname.trim()) {
      delete newBook.author;
    }
  }

  if (!newBook.series?.trim()) delete newBook.series;
  if (!newBook.notes?.trim()) delete newBook.notes;

  return newBook;
}