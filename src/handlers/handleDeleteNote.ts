import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import {
  DeleteNoteActivity,
  NoteDeletedNotification,
  ChannelState,
  WebAppEventContext,
} from '../types';

const handleDeleteNoteActivity = makeContainer({
  deps: [StateController],
})(
  (stateController) => async ({
    bot,
    event: {
      channel,
      payload: { id },
    },
  }: WebAppEventContext<DeleteNoteActivity>) => {
    let isDeleted = false;

    await stateController
      .channelState(channel)
      .update<ChannelState>(NOTE_SPACE_DATA_KEY, (currentState) => {
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

    const notification: NoteDeletedNotification = {
      kind: 'app_data',
      type: 'note_deleted',
      payload: { id },
    };

    if (isDeleted) {
      bot.sendTopic(channel.uid, notification);
    }
  }
);

export default handleDeleteNoteActivity;
