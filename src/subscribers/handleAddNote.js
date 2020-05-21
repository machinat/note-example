import { container } from '@machinat/core/service';
import StateController from '@machinat/state';
import { WALL_DATA_KEY } from '../constant';

const handleAddNote = container({
  deps: [StateController],
})(stateController => async ({ bot, channel, event }) => {
  const { title, content } = event.payload;
  let id;

  await stateController
    .channelState(channel)
    .set(WALL_DATA_KEY, currentState => {
      if (!currentState) {
        id = 1;
        return { idCounter: 1, notes: [{ id: 1, title, content }] };
      }

      const { idCounter, notes } = currentState;
      id = idCounter + 1;
      return {
        idCounter: id,
        notes: [...notes, { id, title, content }],
      };
    });

  bot.sendTopic(channel.uid, {
    type: 'note_added',
    payload: { id, title, content },
  });
});

export default handleAddNote;
