import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { NOTE_DATA_KEY } from '../constant';
import {
  UpdateNoteAction,
  WebviewActionContext,
  NoteUpdatedNotif,
  NoteDataState,
} from '../types';

const handleUpdateNoteAction =
  (stateController: StateController) =>
  async ({
    bot,
    event: {
      payload: { id, title, content },
    },
    metadata: {
      auth: { user, channel: chat },
    },
  }: WebviewActionContext<UpdateNoteAction>) => {
    let isUpdated = false;

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

        isUpdated = true;
        return {
          ...currentState,
          notes: [
            ...notes.slice(0, idx),
            {
              authorId: user.uid,
              id,
              title,
              content,
            },
            ...notes.slice(idx + 1),
          ],
        };
      });

    const notification: NoteUpdatedNotif = {
      category: 'webview_notif',
      type: 'note_updated',
      payload: {
        note: {
          authorId: user.uid,
          id,
          title,
          content,
        },
      },
    };

    if (isUpdated) {
      await bot.sendTopic(chat.uid, notification);
    }
  };

export default makeContainer({
  deps: [StateController],
})(handleUpdateNoteAction);
