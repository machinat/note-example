import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import WebviewClient from '@machinat/webview/client';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { ContentState, convertToRaw } from 'draft-js';
import NavBar from '../components/NavBar';
import NoteEditor from '../components/NoteEditor';
import NotesArea from '../components/NotesArea';
import useAppData from '../hooks/useAppData';
import useSearchFilter from '../hooks/useSearchFilter';
import {WebAppClient} from '../types'

const useStyles = makeStyles((theme) => ({
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

const { publicRuntimeConfig } = getConfig();

const client :WebAppClient= new WebviewClient(
  typeof window === 'undefined'
    ? { mockupMode: true, authorizers: [] }
    : {
        authorizers: [
          new MessengerClientAuthorizer({
            appId: publicRuntimeConfig.messengerAppId,
          }),
          new TelegramClientAuthorizer(),
          new LineClientAuthorizer({
            liffId: publicRuntimeConfig.lineLiffId,
          }),
        ],
      }
);

const NoteHome = () => {
  const classes = useStyles();
  const appData = useAppData(client);

  const [editingNote, setEditingNote] = React.useState<null | { content: any }>(
    null
  );
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
        category: 'webview_action',
        type: 'add_note',
        payload: { title, content: rawContent },
      });
    } else {
      client.send({
        category: 'webview_action',
        type: 'update_note',
        payload: { id, title, content: rawContent },
      });
    }
  };

  // note operations
  const deleteNote = (note) => {
    client.send({
      category: 'webview_action',
      type: 'delete_note',
      payload: { id: note.id },
    });
  };

  const editNote = (note) => {
    setEditingNote(note);
  };

  // handle search
  const [searchText, setSearchText] = React.useState('');
  const notesToShow = useSearchFilter(appData?.notes, searchText);

  return (
    <>
      <Head>
        <title>Machinat Note Example</title>
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

        <NoteEditor
          note={editingNote}
          handleFinish={handleEditorFinish}
          platform={client?.authContext?.platform}
        />
      </div>
    </>
  );
};

export default NoteHome;
