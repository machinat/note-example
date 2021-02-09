import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import {
  AddNoteActivity,
  WebAppEventContext,
  NoteAddedNotification,
  ChannelState,
} from '../types';

const handleAddNoteActivity = makeContainer({
  deps: [StateController],
})(
  (stateController) => async ({
    bot,
    event: {
      channel,
      payload: { title, content },
    },
  }: WebAppEventContext<AddNoteActivity>) => {
    let id = 1;

    await stateController
      .channelState(channel)
      .update<ChannelState>(NOTE_SPACE_DATA_KEY, (currentState) => {
        if (!currentState) {
          return {
            chatBeginAt: Date.now(),
            idCounter: 1,
            notes: [{ id: 1, title, content }],
          };
        }

        const { idCounter, notes } = currentState;
        id = idCounter + 1;
        return {
          ...currentState,
          idCounter: id,
          notes: [...notes, { id, title, content }],
        };
      });

    const notification: NoteAddedNotification = {
      kind: 'app_data',
      type: 'note_added',
      payload: { id, title, content },
    };

    bot.sendTopic(channel.uid, notification);
  }
);

export default handleAddNoteActivity;
