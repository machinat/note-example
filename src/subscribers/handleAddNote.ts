import { container } from '@machinat/core/service';
import WebSocket from '@machinat/websocket';
import Base from '@machinat/core/base';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import { AddNote, WebViewEventContext, NoteAddedNotification } from '../types';

const handleAddNote = container({
  deps: [WebSocket.Bot, Base.StateControllerI],
})(
  (webSocketBot, stateController) => async ({
    event: {
      channel,
      payload: { title, content },
    },
  }: WebViewEventContext<AddNote>) => {
    let id = 1;

    await stateController
      .channelState(channel)
      .set(NOTE_SPACE_DATA_KEY, (currentState) => {
        if (!currentState) {
          return { idCounter: 1, notes: [{ id: 1, title, content }] };
        }

        const { idCounter, notes } = currentState;
        id = idCounter + 1;
        return {
          idCounter: id,
          notes: [...notes, { id, title, content }],
        };
      });

    const notification: NoteAddedNotification = {
      kind: 'notification',
      type: 'note_added',
      payload: { id, title, content },
    };

    webSocketBot.sendTopic(channel.uid, notification);
  }
);

export default handleAddNote;
