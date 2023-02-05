import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button, Collapse, ListItem, ListItemText, ListItemIcon, ListItemButton, Stack,
} from '@mui/material';
import { ExpandMore, ExpandLess, MenuBook } from '@mui/icons-material';

import { Book, SetOwnedCallback } from '../types';
import * as tools from '../tools/tools';

interface BookEntryProps {
  book: Book,
  setOwned: SetOwnedCallback,
  hideAuthor?: boolean,
  startExpanded?: boolean,
}

const emptyStyle = {
  fontStyle: 'italic',
  opacity: 0.6,
};

export default function BookEntry({
  book, setOwned, hideAuthor, startExpanded,
}: BookEntryProps): JSX.Element {
  const [expanded, setExpanded] = React.useState(startExpanded);

  const navigate = useNavigate();
  const edit = () => {
    navigate(`/edit/${encodeURIComponent(String(book.id))}`);
  };

  const setBookOwned = () => {
    setOwned(book, true);
  };

  return (
    <>
      <ListItemButton
        onClick={() => setExpanded(!expanded)}
        sx={{
          '&:hover .ExpandButton': { opacity: 1 },
        }}
      >
        <ListItemIcon>
          <MenuBook />
        </ListItemIcon>
        <ListItemText
          primary={book.title}
          secondary={expanded ? null : book.notes}
          secondaryTypographyProps={{ noWrap: true }}
        />
        { expanded
          ? <ExpandLess />
          : <ExpandMore className="ExpandButton" sx={{ opacity: 0 }} /> }
      </ListItemButton>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem>
          <ListItemText inset>
            { book.series && <div>Series: { book.series }</div> }

            { !hideAuthor
            && (book.author ? (
              <div>Author: { tools.authorName(book.author) }</div>
            ) : (
              <div style={emptyStyle}>Author unknown</div>
            )) }

            { book.notes ? (
              <div
                style={{
                  whiteSpace: 'pre-line',
                  marginTop: '0.25em',
                  marginBottom: '0.25em',
                }}
              >Notes: { book.notes }
              </div>
            ) : (
              <div style={emptyStyle}>No notes.</div>
            ) }

            <div style={{ marginBottom: '0.5em' }}>
              { 'Last updated ' }
              { tools.formatMTime(book.mtime) }
            </div>
            <Stack direction="row" justifyContent="flex-end" gap="1em">
              { book.owned || (
                <Button color="primary" variant="outlined" onClick={setBookOwned}>
                  I have it now
                </Button>
              ) }
              <Button color="primary" variant="outlined" onClick={edit}>
                Edit
              </Button>
            </Stack>
          </ListItemText>
        </ListItem>
      </Collapse>
    </>
  );
}
