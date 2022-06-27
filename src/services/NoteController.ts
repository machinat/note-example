import {
  makeClassProvider,
  StateController,
  SociablyChannel,
  SociablyUser,
} from '@sociably/core';
import { NOTE_DATA_KEY } from '../constant';
import type { NoteData, NoteDataState } from '../types';

export class NoteController {
  stateController: StateController;

  constructor(stateController: StateController) {
    this.stateController = stateController;
  }

  async getNoteData(chat: SociablyChannel): Promise<NoteDataState> {
    const data = await this.stateController
      .channelState(chat)
      .get<NoteDataState>(NOTE_DATA_KEY);
    return data || { idCounter: 0, notes: [] };
  }

  async addNote(
    chat: SociablyChannel,
    author: SociablyUser,
    title: string,
    content: string
  ): Promise<{ note: NoteData; data: NoteDataState }> {
    let note: NoteData;

    const data = await this.stateController
      .channelState(chat)
      .update<NoteDataState>(
        NOTE_DATA_KEY,
        ({ idCounter, notes } = { idCounter: 0, notes: [] }) => {
          const id = idCounter + 1;
          note = { authorId: author.uid, id, title, content };
          return {
            idCounter: id,
            notes: [...notes, note],
          };
        }
      );

    return { data, note: note! };
  }

  async updateNote(
    chat: SociablyChannel,
    id: number,
    title: string,
    content: string
  ): Promise<{ note: null | NoteData; data: NoteDataState }> {
    let updatedNote: undefined | NoteData;

    const data = await this.stateController
      .channelState(chat)
      .update<NoteDataState>(
        NOTE_DATA_KEY,
        ({ idCounter, notes } = { idCounter: 0, notes: [] }) => {
          const idx = notes.findIndex((note) => note.id === id);
          if (idx === -1) {
            return { idCounter, notes };
          }

          updatedNote = {
            ...notes[idx],
            title,
            content,
          };
          return {
            idCounter,
            notes: [
              ...notes.slice(0, idx),
              updatedNote,
              ...notes.slice(idx + 1),
            ],
          };
        }
      );

    return { data, note: updatedNote || null };
  }

  async deleteNote(
    chat: SociablyChannel,
    id: number
  ): Promise<{ note: null | NoteData; data: NoteDataState }> {
    let deletedNote: undefined | NoteData;

    const data = await this.stateController
      .channelState(chat)
      .update<NoteDataState>(
        NOTE_DATA_KEY,
        ({ idCounter, notes } = { idCounter: 0, notes: [] }) => {
          const idx = notes.findIndex((note) => note.id === id);
          if (idx === -1) {
            return { idCounter, notes };
          }

          deletedNote = notes[idx];
          return {
            idCounter,
            notes: [...notes.slice(0, idx), ...notes.slice(idx + 1)],
          };
        }
      );

    return { data, note: deletedNote || null };
  }
}

export default makeClassProvider({ deps: [StateController] })(NoteController);
