import React, { useState } from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { useClient } from '@machinat/webview/client';
import MessengerAuth from '@machinat/messenger/webview/client';
import TelegramAuth from '@machinat/telegram/webview/client';
import LineAuth from '@machinat/line/webview/client';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { amber } from '@mui/material/colors';
import { ContentState, convertToRaw } from 'draft-js';
import NavBar from '../components/NavBar';
import NoteEditor from '../components/NoteEditor';
import NotesArea from '../components/NotesArea';
import useAppData from '../hooks/useAppData';
import useSearchFilter from '../hooks/useSearchFilter';
import { WebviewPush, NoteData } from '../types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: amber,
  },
});

const {
  publicRuntimeConfig: { MESSENGER_PAGE_ID, TELEGRAM_BOT_NAME, LINE_LIFF_ID },
} = getConfig();

const NoteApp = () => {
  const client = useClient<
    MessengerAuth | TelegramAuth | LineAuth,
    WebviewPush
  >({
    mockupMode: typeof window === 'undefined',
    authPlatforms: [
      new MessengerAuth({ pageId: MESSENGER_PAGE_ID }),
      new TelegramAuth({ botName: TELEGRAM_BOT_NAME }),
      new LineAuth({ liffId: LINE_LIFF_ID }),
    ],
  });

  const appData = useAppData(client);
  const [editingNote, setEditingNote] = useState<{ content: string } | null>(
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
  const deleteNote = (note: NoteData) => {
    client.send({
      category: 'webview_action',
      type: 'delete_note',
      payload: { id: note.id },
    });
  };

  const editNote = (note: NoteData) => {
    setEditingNote(note);
  };

  // handle search
  const [searchText, setSearchText] = React.useState('');
  const notesToShow = useSearchFilter(appData?.notes, searchText);

  return (
    <>
      <Head>
        <title>Machinat Note Example</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <style global jsx>{`
          body {
            margin: 0;
          }
        `}</style>
      </Head>

      <ThemeProvider theme={theme}>
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            maxWidth: '100%',
            display: 'flex',
            backgroundColor: `${theme.palette.background.default}`,
          }}
        >
          <Box
            sx={{
              width: '100%',
              padding: theme.spacing(10, 2, 2, 2),
            }}
          >
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
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: theme.spacing(-10),
                }}
              >
                <CircularProgress color="secondary" size="4em" />
              </Box>
            )}
          </Box>

          <NoteEditor
            note={editingNote}
            handleFinish={handleEditorFinish}
            platform={client?.authContext?.platform}
          />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default NoteApp;

// to activate publicRuntimeConfig
export async function getServerSideProps(context) {
  return { props: {} };
}
