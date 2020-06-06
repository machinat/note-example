import { container } from '@machinat/core/service';
import Base from '@machinat/core/base';
import WebSocket from '@machinat/websocket';
import { WALL_DATA_KEY } from '../constant';

const handleUpdateNote = container({
  deps: [WebSocket.Bot, Base.StateControllerI],
})((webSocketBot, stateController) => async ({ channel, event }) => {
  const { id, title, content } = event.payload;
  let isUpdated = false;

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

  if (isUpdated) {
    webSocketBot.sendTopic(channel.uid, {
      type: 'note_updated',
      payload: { id, title, content },
    });
  }
});

export default handleUpdateNote;
