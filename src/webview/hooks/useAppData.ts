import { useEventReducer, ClientEventContext } from '@machinat/webview/client';
import { convertFromRaw } from 'draft-js';
import type { AppData, NoteData } from '../../types';
import { WebAppClient, WebAppEventContext } from '../types';

const convertNoteFromRaw = (rawNote: NoteData) => {
  const content = convertFromRaw(rawNote.content);
  const text = content.getPlainText();

  return {
    ...rawNote,
    content,
    text,
  };
};

const appDataReducer = (
  data: null | AppData,
  { event }: WebAppEventContext
): null | AppData => {
  if (event.type === 'app_data') {
    const { notes, ...restData } = event.payload;
    return {
      ...restData,
      notes: notes.map(convertNoteFromRaw),
    };
  }

  if (!data) {
    return null;
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

const useAppData = (client: WebAppClient): null | AppData =>
  useEventReducer(client, appDataReducer, null);

export default useAppData;
