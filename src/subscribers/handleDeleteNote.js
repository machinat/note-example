import { container } from '@machinat/core/service';
import Base from '@machinat/core/base';
import WebSocket from '@machinat/websocket';
import { NOTE_SPACE_DATA_KEY } from '../constant';

const handleDeleteNote = container({
  deps: [WebSocket.Bot, Base.StateControllerI],
})((webSocketBot, stateController) => async ({ channel, event }) => {
  const { id } = event.payload;
  let isDeleted = false;

  await stateController
    .channelState(channel)
    .set(NOTE_SPACE_DATA_KEY, currentState => {
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
    webSocketBot.sendTopic(channel.uid, {
      type: 'note_deleted',
      payload: { id },
    });
  }
});

export default handleDeleteNote;
