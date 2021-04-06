import React from 'react';
import { convertFromRaw } from 'draft-js';
import type { AppData, WebviewNotif, NoteData } from '../../types';

const convertNoteFromRaw = (rawNote: NoteData) => {
  const content = convertFromRaw(rawNote.content);
  const text = content.getPlainText();

  return {
    ...rawNote,
    content,
    text,
  };
};

const appDataReducer = (data: null | AppData, event: WebviewNotif): AppData => {
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
      notes: [...data.notes, convertNoteFromRaw(event.payload.note)],
    };
  }

  if (event.type === 'note_deleted') {
    const { notes } = data;
    const { id } = event.payload;

    const idx = notes.findIndex((note) => note.id === id);
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

    const idx = notes.findIndex((note) => note.id === updatedNote.note.id);
    if (idx === -1) {
      return data;
    }

    return {
      ...data,
      notes: [
        ...notes.slice(0, idx),
        convertNoteFromRaw(updatedNote.note),
        ...notes.slice(idx + 1),
      ],
    };
  }

  return data;
};

const useAppData = (client): null | AppData => {
  const [appData, dispatch] = React.useReducer(appDataReducer, null);
  React.useEffect(() => {
    if (client) {
      client.onEvent((event) => {
        dispatch(event);
      });
    }
  }, [client]);

  return appData;
};

export default useAppData;
