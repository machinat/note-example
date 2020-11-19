import { container } from '@machinat/core/service';
import WebSocket from '@machinat/websocket';
import Base from '@machinat/core/base';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import {
  AddNote,
  WebViewEventContext,
  NoteAddedNotification,
  SpaceData,
} from '../types';

const handleAddNote = container({
  deps: [WebSocket.Bot, Base.StateControllerI],
})(
  (
    webSocketBot: WebSocket.Bot,
    stateController: Base.StateControllerI
  ) => async ({
    event: {
      channel,
      payload: { title, content },
    },
  }: WebViewEventContext<AddNote>) => {
    let id = 1;

    await stateController
      .channelState(channel)
      .update<SpaceData>(NOTE_SPACE_DATA_KEY, (currentState) => {
        if (!currentState) {
          return {
            beginTime: Date.now(),
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
      kind: 'notification',
      type: 'note_added',
      payload: { id, title, content },
    };

    webSocketBot.sendTopic(channel.uid, notification);
  }
);

export default handleAddNote;
