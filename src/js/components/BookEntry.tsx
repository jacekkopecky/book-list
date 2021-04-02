import * as React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

import MenuBook from '@material-ui/icons/MenuBook';

import './BookEntry.css';

import { Book, SetOwnedCallback } from '../types';
import * as tools from '../tools/tools';

interface BookEntryProps {
  book: Book,
  setOwned: SetOwnedCallback,
}

export default function BookEntry({ book, setOwned }: BookEntryProps): JSX.Element {
  const [expanded, setExpanded] = React.useState(false);

  const history = useHistory();
  const edit = () => {
    history.push(`/edit/${encodeURIComponent(String(book.id))}`);
  };

  const setBookOwned = () => {
    setOwned(book, true);
  };

  return (
    <>
      <ListItem className="BookEntry" button onClick={() => setExpanded(!expanded)}>
        <ListItemIcon><MenuBook /></ListItemIcon>
        <ListItemText primary={book.title} />
        { expanded ? <ExpandLess /> : <ExpandMore className="ExpandButton" /> }
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem
          className="ExpandedBook"
        >
          <ListItemText inset>
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
            <Grid container className="buttons">
              { book.owned || (
                <Button color="primary" variant="outlined" onClick={setBookOwned}>
                  I have it now
                </Button>
              ) }
              <Button color="primary" variant="outlined" onClick={edit}>Edit</Button>
            </Grid>
          </ListItemText>
        </ListItem>
      </Collapse>
    </>
  );
}
