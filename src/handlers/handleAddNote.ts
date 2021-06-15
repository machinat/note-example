import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { NOTE_DATA_KEY } from '../constant';
import {
  AddNoteAction,
  WebviewActionContext,
  NoteAddedPush,
  NoteDataState,
} from '../types';

const handleAddNoteAction =
  (stateController: StateController) =>
  async ({
    bot,
    event: {
      payload: { title, content },
    },
    metadata: {
      auth: { user, channel: chat },
    },
  }: WebviewActionContext<AddNoteAction>) => {
    let id = 1;

    await stateController
      .channelState(chat)
      .update<NoteDataState>(NOTE_DATA_KEY, (currentState) => {
        if (!currentState) {
          return {
            idCounter: 1,
            notes: [{ authorId: user.uid, id: 1, title, content }],
          };
        }

        const { idCounter, notes } = currentState;
        id = idCounter + 1;
        return {
          idCounter: id,
          notes: [...notes, { authorId: user.uid, id, title, content }],
        };
      });

    const notification: NoteAddedPush = {
      category: 'webview_push',
      type: 'note_added',
      payload: {
        note: { authorId: user.uid, id, title, content },
      },
    };

    await bot.sendTopic(chat.uid, notification);
  };

export default makeContainer({
  deps: [StateController],
})(handleAddNoteAction);
