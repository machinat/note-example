import { container } from '@machinat/core/service';
import Base from '@machinat/core/base';
import WebSocket from '@machinat/websocket';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import {
  DeleteNote,
  WebViewEventContext,
  NoteDeletedNotification,
  SpaceData,
} from '../types';

const handleDeleteNote = container({
  deps: [WebSocket.Bot, Base.StateControllerI],
})(
  (
    webSocketBot: WebSocket.Bot,
    stateController: Base.StateControllerI
  ) => async ({
    event: {
      channel,
      payload: { id },
    },
  }: WebViewEventContext<DeleteNote>) => {
    let isDeleted = false;

    await stateController
      .channelState(channel)
      .update<SpaceData>(NOTE_SPACE_DATA_KEY, (currentState) => {
        if (!currentState) {
          return undefined;
        }

        const { notes } = currentState;
        const idx = notes.findIndex((note) => note.id === id);
        if (idx === -1) {
          return currentState;
        }

        isDeleted = true;
        return {
          ...currentState,
          notes: [...notes.slice(0, idx), ...notes.slice(idx + 1)],
        };
      });

    const notification: NoteDeletedNotification = {
      kind: 'notification',
      type: 'note_deleted',
      payload: { id },
    };

    if (isDeleted) {
      webSocketBot.sendTopic(channel.uid, notification);
    }
  }
);

export default handleDeleteNote;
