import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import {
  UpdateNoteActivity,
  WebAppEventContext,
  NoteUpdatedNotification,
  ChannelState,
} from '../types';

const handleUpdateNoteActivity = makeContainer({
  deps: [StateController],
})(
  (stateController) => async ({
    bot,
    event: {
      channel,
      payload: { id, title, content },
    },
  }: WebAppEventContext<UpdateNoteActivity>) => {
    let isUpdated = false;

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

        isUpdated = true;
        return {
          ...currentState,
          notes: [
            ...notes.slice(0, idx),
            { id, title, content },
            ...notes.slice(idx + 1),
          ],
        };
      });

    const notification: NoteUpdatedNotification = {
      kind: 'app_data',
      type: 'note_updated',
      payload: { id, title, content },
    };

    if (isUpdated) {
      bot.sendTopic(channel.uid, notification);
    }
  }
);

export default handleUpdateNoteActivity;
