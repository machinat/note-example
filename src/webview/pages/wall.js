import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { ContentState } from 'draft-js';
import NavBar from '../components/NavBar';
import NoteEditor from '../components/NoteEditor';
import NoteCard from '../components/NoteCard';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    scrollbarWidth: 'none',
    display: 'flex',
    backgroundColor: `${theme.palette.background.default}`,
  },
  frame: {
    width: '100%',
    padding: theme.spacing(10, 2, 2, 2),
  },
  notesColumns: {
    columnWidth: '19em',
    columnGap: theme.spacing(2),
  },
}));

let _id = 0;

const Wall = () => {
  const classes = useStyles();

  const [editing, setEditing] = React.useState(null);
  const handleAddNewNote = () => {
    _id += 1;
    setEditing({
      id: _id,
      content: ContentState.createFromText('Hello world!'),
    });
  };

  const [notes, setNotes] = React.useState([]);

  const handleEditorFinish = content => {
    if (editing) {
      const { id } = editing;

      setEditing(null);
      setNotes(existed => [...existed, { id, content }]);
    }
  };

  return (
    <div className={classes.root}>
      <Box className={classes.frame}>
        <NavBar handleOpenDrawer={() => {}} handleAddNote={handleAddNewNote} />

        <Container className={classes.notesColumns}>
          {notes.map(({ id, content }) => (
            <NoteCard key={id} content={content} />
          ))}
        </Container>
      </Box>

      <NoteEditor
        editingContent={editing?.content}
        handleFinish={handleEditorFinish}
      />
    </div>
  );
};

export default Wall;
