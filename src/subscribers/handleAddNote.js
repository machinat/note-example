import { container } from '@machinat/core/service';
import WebSocket from '@machinat/websocket';
import Base from '@machinat/core/base';
import { WALL_DATA_KEY } from '../constant';

const handleAddNote = container({
  deps: [WebSocket.Bot, Base.StateControllerI],
})((webSocketBot, stateController) => async ({ channel, event }) => {
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

  webSocketBot.sendTopic(channel.uid, {
    type: 'note_added',
    payload: { id, title, content },
  });
});

export default handleAddNote;
