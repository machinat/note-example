import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';

import WebSocketClient from '@machinat/websocket/client';
import useAuth from '@machinat/websocket/auth/client';
import AuthController from '@machinat/auth/client';
import MessengerAuthorizer from '@machinat/messenger/auth/client';
import LineAuthorizer from '@machinat/line/auth/client';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { ContentState, convertToRaw } from 'draft-js';

import NavBar from '../components/NavBar';
import NoteEditor from '../components/NoteEditor';
import NotesArea from '../components/NotesArea';
import useAppData from '../hooks/useAppData';
import useSearchFilter from '../hooks/useSearchFilter';

let client = null;
if (typeof window !== 'undefined') {
  const {
    publicRuntimeConfig: {
      fbAppId,
      lineProviderId,
      lineBotChannelId,
      lineLIFFId,
    },
  } = getConfig();

  const clientAuthController = new AuthController({
    serverURL: '/auth',
    providers: [
      new MessengerAuthorizer({
        appId: fbAppId,
      }),
      new LineAuthorizer({
        providerId: lineProviderId,
        botChannelId: lineBotChannelId,
        liffId: lineLIFFId,
      }),
    ],
  })
    .on('error', console.error)
    .bootstrap();

  client = new WebSocketClient({
    url: '/websocket',
    authorizeLogin: useAuth(clientAuthController),
  });
}

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
  progressRoot: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(-10),
  },
}));

const NoteSpace = () => {
  const classes = useStyles();
  const appData = useAppData(client);

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
  const notesToShow = useSearchFilter(appData?.notes, searchText);

  const spaceType = appData?.spaceType;
  return (
    <>
      <Head>
        <title>
          {spaceType === 'own'
            ? 'Your Own Space'
            : spaceType === 'chat'
            ? 'Private Chat Space'
            : spaceType === 'group'
            ? 'Group Chat Space'
            : 'Note Machina'}
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

          {appData ? (
            <NotesArea
              isEmpty={appData.notes.length === 0}
              notes={notesToShow}
              editNote={editNote}
              deleteNote={deleteNote}
            />
          ) : (
            <div className={classes.progressRoot}>
              <CircularProgress color="secondary" size="4em" />
            </div>
          )}
        </Box>

        <NoteEditor note={editingNote} handleFinish={handleEditorFinish} />
      </div>
    </>
  );
};

// NOTE: to activate publicRuntimeConfig
export const getServerSideProps = async () => ({
  props: {
    initialData: null,
  },
});

export default NoteSpace;
