import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CreateIcon from '@mui/icons-material/Create';
import { useTheme } from '@mui/material/styles';

import NoteCard from './NoteCard';

const NoteArea = ({ notes, isEmpty, editNote, deleteNote }) => {
  const theme = useTheme();

  if (isEmpty) {
    return (
      <Box
        sx={{
          fontSize: '1.5em',
          textAlign: 'center',
          padding: theme.spacing(7, 7),
          color: theme.palette.primary.dark,
        }}
      >
        You don't have any note yet, press <CreateIcon /> to create one!
      </Box>
    );
  }

  return (
    <Container sx={{ columnWidth: '19em', columnGap: theme.spacing(2) }}>
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
