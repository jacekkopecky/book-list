import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Autocomplete, Button, Grid, TextField, Typography, Switch,
} from '@mui/material';

import MainHeading from './MainHeading';

import {
  Book, NewBook, SaveBookCallback, DeleteBookCallback, AddBookCallback,
} from '../types';
import * as tools from '../tools/tools';

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
  const navigate = useNavigate();

  // clone the book for changing
  // we use an empty author so it's easier to handle, and we remove it when saving
  const [book, setBook] = React.useState(() => ({
    author: { fname: '', lname: '' },
    ...props.originalBook,
  }));

  const setAuthorFname = (value: string) => {
    const newBook = { ...book };
    newBook.author.fname = value;
    setBook(newBook);
  };

  const setAuthorLname = (value: string) => {
    const newBook = { ...book };
    newBook.author.lname = value;
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
    navigate(-1);
    // todo could go forward instead (then browser back will return to editing)
    // but if we don't have an ID, we need to get it from props.add()
    // and first navigate(...,{replace:true}) as if we were editing that book all along
    // going forward would go to the list of books by the same author,
    // owned or not depending on the book
  };

  const doDelete = () => {
    if (!props.save) return; // delete shouldn't be called on a new book

    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure to delete “${props.originalBook.title}”?`)) {
      props.delete(props.originalBook);
      navigate(-1);
    }
  };

  const doCancel = () => {
    navigate(-1);
  };

  const title = props.save ? `Editing ${props.originalBook.title}` : 'Adding a new book';

  return (
    <MainHeading title={title}>
      <Typography
        component="div"
        style={{
          paddingTop: '1em',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Grid container spacing={1}>
          <Grid
            xs={12}
            item
            container
            flexGrow={1}
            direction="row"
            gap={1}
            component="label"
            justifyContent="flex-end"
            alignItems="center"
          >
            <span>Want it</span>
            <Switch
              checked={book.owned ?? false}
              color="primary"
              onChange={(e) => setBook({ ...book, owned: e.target.checked })}
            />
            <span>Have it</span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Title"
              data-testid="title"
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
              onChange={(_, value) => setAuthorFname(value ?? '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setAuthorFname(e.target.value)}
                  label="Author"
                  data-testid="fname"
                  margin="normal"
                  fullWidth
                  helperText="first name"
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
              onChange={(_, value) => setAuthorLname(value ?? '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setAuthorLname(e.target.value)}
                  label=" "
                  data-testid="lname"
                  margin="normal"
                  fullWidth
                  helperText="last name"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={unique(props.knownBooks.map((b) => b.series))}
              value={book.series ?? ''}
              onChange={(_, value) => setBook({ ...book, series: value ?? undefined })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setBook({ ...book, series: e.target.value })}
                  label="Series"
                  data-testid="series"
                  margin="normal"
                  placeholder="optional"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              data-testid="notes"
              multiline
              margin="normal"
              placeholder="optional"
              fullWidth
              value={book.notes ?? ''}
              onChange={(e) => setBook({ ...book, notes: e.target.value })}
            />
          </Grid>
        </Grid>
        <Grid
          container
          alignContent="flex-end"
          style={{
            flexGrow: 1,
            marginBottom: '24px',
          }}
        >
          <Grid item container xs={6} justifyContent="flex-start">
            { props.save ? (
              <Button color="secondary" variant="contained" onClick={doDelete}>
                Delete
              </Button>
            ) : (
              <Button variant="contained" onClick={doCancel}>
                Cancel
              </Button>
            ) }
          </Grid>
          <Grid item container xs={6} justifyContent="flex-end">
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
