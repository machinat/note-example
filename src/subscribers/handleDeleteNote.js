import { container } from '@machinat/core/service';
import StateController from '@machinat/state';
import { WALL_DATA_KEY } from '../constant';

const handleDeleteNote = container({
  deps: [StateController],
})(stateController => async ({ bot, channel, event }) => {
  const { id } = event.payload;
  let isDeleted = false;

  await stateController
    .channelState(channel)
    .set(WALL_DATA_KEY, currentState => {
      if (!currentState) {
        return undefined;
      }

      const { notes } = currentState;
      const idx = notes.findIndex(note => note.id === id);
      if (idx === -1) {
        return currentState;
      }

      isDeleted = true;
      return {
        ...currentState,
        notes: [...notes.slice(0, idx), ...notes.slice(idx + 1)],
      };
    });

  if (isDeleted) {
    bot.sendTopic(channel.uid, {
      type: 'note_deleted',
      payload: { id },
    });
  }
});

export default handleDeleteNote;
