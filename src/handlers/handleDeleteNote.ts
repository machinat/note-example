import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { NOTE_DATA_KEY } from '../constant';
import {
  DeleteNoteAction,
  NoteDeletedNotif,
  NoteDataState,
  WebviewActionContext,
} from '../types';

const handleDeleteNoteAction = makeContainer({
  deps: [StateController],
})(
  (stateController) => async ({
    bot,
    event: {
      payload: { id },
    },
    metadata: {
      auth: { channel: chat },
    },
  }: WebviewActionContext<DeleteNoteAction>) => {
    let isDeleted = false;

    await stateController
      .channelState(chat)
      .update<NoteDataState>(NOTE_DATA_KEY, (currentState) => {
        if (!currentState) {
          return undefined;
        }

        const { notes } = currentState;
        const idx = notes.findIndex((note) => note.id === id);
        if (idx === -1) {
          return currentState;
        }

        isDeleted = true;
        return {
          ...currentState,
          notes: [...notes.slice(0, idx), ...notes.slice(idx + 1)],
        };
      });

    const notification: NoteDeletedNotif = {
      kind: 'notif',
      type: 'note_deleted',
      payload: { id },
    };

    if (isDeleted) {
      await bot.sendTopic(chat.uid, notification);
    }
  }
);

export default handleDeleteNoteAction;
