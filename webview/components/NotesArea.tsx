import React from 'react';
import CreateIcon from '@material-ui/icons/Create';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import NoteCard from './NoteCard';

const useStyles = makeStyles((theme) => ({
  notesColumns: {
    columnWidth: '19em',
    columnGap: theme.spacing(2),
  },
  emptyHint: {
    fontSize: '1.5em',
    textAlign: 'center',
    padding: theme.spacing(7, 7),
    color: theme.palette.primary.dark,
  },
}));

const NoteArea = ({ notes, isEmpty, editNote, deleteNote }) => {
  const classes = useStyles();

  if (isEmpty) {
    return (
      <div className={classes.emptyHint}>
        You don't have any note yet, press <CreateIcon /> to create one!
      </div>
    );
  }

  return (
    <Container className={classes.notesColumns}>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          handleDelete={deleteNote.bind(null, note)}
          handleEdit={editNote.bind(null, note)}
        />
      ))}
    </Container>
  );
};

export default NoteArea;
