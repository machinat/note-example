import React from 'react';
import Head from 'next/head';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';
import { ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import NavBar from '../components/NavBar';
import NoteEditor from '../components/NoteEditor';
import NoteCard from '../components/NoteCard';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    maxWidth: '100%',
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
  progressRoot: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(-10),
  },
  emptyHint: {
    fontSize: '1.5em',
    textAlign: 'center',
    padding: theme.spacing(7, 7),
    color: theme.palette.primary.dark,
  },
}));

const convertNoteFromRaw = rawNote => {
  const content = convertFromRaw(rawNote.content);
  const text = content.getPlainText();

  return {
    ...rawNote,
    content,
    text,
  };
};

const wallAppReducer = (data, event) => {
  if (event.type === 'app_data') {
    const { notes, ...restData } = event.payload;
    return {
      ...restData,
      notes: notes.map(convertNoteFromRaw),
    };
  }

  if (event.type === 'note_added') {
    return {
      ...data,
      notes: [...data.notes, convertNoteFromRaw(event.payload)],
    };
  }

  if (event.type === 'note_deleted') {
    const { notes } = data;
    const { id } = event.payload;

    const idx = notes.findIndex(note => note.id === id);
    if (idx === -1) {
      return data;
    }

    return {
      ...data,
      notes: [...notes.slice(0, idx), ...notes.slice(idx + 1)],
    };
  }

  if (event.type === 'note_updated') {
    const { notes } = data;
    const updatedNote = event.payload;

    const idx = notes.findIndex(note => note.id === updatedNote.id);
    if (idx === -1) {
      return data;
    }

    return {
      ...data,
      notes: [
        ...notes.slice(0, idx),
        convertNoteFromRaw(updatedNote),
        ...notes.slice(idx + 1),
      ],
    };
  }

  return data;
};

const Wall = ({ client }) => {
  const classes = useStyles();

  // data reducer
  const [appData, dispatch] = React.useReducer(wallAppReducer, null);
  React.useEffect(() => {
    if (client) {
      client.onEvent(event => {
        dispatch(event);
      });
    }
  }, [client]);

  // control editor
  const [editingNote, setEditingNote] = React.useState(null);
  const handleAddNote = () => {
    setEditingNote({
      content: ContentState.createFromText('Hello World!'),
    });
  };

  const handleEditorFinish = ({ id, title, content }) => {
    setEditingNote(null);
    const rawContent = convertToRaw(content);

    if (id === undefined) {
      client.send({
        type: 'add_note',
        payload: { title, content: rawContent },
      });
    } else {
      client.send({
        type: 'update_note',
        payload: { id, title, content: rawContent },
      });
    }
  };

  // note operations
  const deleteNote = note => {
    client.send({
      type: 'delete_note',
      payload: { id: note.id },
    });
  };

  const editNote = note => {
    setEditingNote(note);
  };

  // handle search
  const [searchText, setSearchText] = React.useState('');
  const lowerCasedSearch = searchText.toLowerCase();
  const notesToShow = React.useMemo(
    () =>
      appData?.notes.filter(({ title, text }) => {
        return (
          title.toLowerCase().indexOf(lowerCasedSearch) !== -1 ||
          text.toLowerCase().indexOf(lowerCasedSearch) !== -1
        );
      }) || [],
    [appData?.notes, lowerCasedSearch]
  );

  const spaceType = appData?.spaceType;
  return (
    <>
      <Head>
        <title>
          {spaceType === 'own'
            ? 'Your Own Wall'
            : spaceType === 'chat'
            ? 'Private Chat Wall'
            : spaceType === 'group'
            ? 'Group Chat Wall'
            : 'Wall Machina'}
        </title>
      </Head>

      <div className={classes.root}>
        <Box className={classes.frame}>
          <NavBar
            appData={appData}
            handleAddNote={handleAddNote}
            searchText={searchText}
            handleSearchChange={setSearchText}
          />

          {!appData ? (
            <div className={classes.progressRoot}>
              <CircularProgress color="secondary" size="4em" />
            </div>
          ) : notesToShow.length > 0 ? (
            <Container className={classes.notesColumns}>
              {notesToShow.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  handleDelete={deleteNote.bind(null, note)}
                  handleEdit={editNote.bind(null, note)}
                />
              ))}
            </Container>
          ) : (
            <div className={classes.emptyHint}>
              You don't have any note yet, press <CreateIcon /> to create one!
            </div>
          )}
        </Box>

        <NoteEditor note={editingNote} handleFinish={handleEditorFinish} />
      </div>
    </>
  );
};

export default Wall;
