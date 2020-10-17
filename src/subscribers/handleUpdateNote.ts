import { container } from '@machinat/core/service';
import Base from '@machinat/core/base';
import WebSocket from '@machinat/websocket';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import {
  UpdateNote,
  WebViewEventContext,
  NoteUpdatedNotification,
} from '../types';

const handleUpdateNote = container({
  deps: [WebSocket.Bot, Base.StateControllerI],
})(
  (webSocketBot, stateController) => async ({
    event: {
      channel,
      payload: { id, title, content },
    },
  }: WebViewEventContext<UpdateNote>) => {
    let isUpdated = false;

    await stateController
      .channelState(channel)
      .set(NOTE_SPACE_DATA_KEY, (currentState) => {
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
      kind: 'notification',
      type: 'note_updated',
      payload: { id, title, content },
    };

    if (isUpdated) {
      webSocketBot.sendTopic(channel.uid, notification);
    }
  }
);

export default handleUpdateNote;
