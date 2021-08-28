import { makeContainer } from '@machinat/core/service';
import NoteController from '../services/NoteController';
import useUserProfile from '../services/useUserProfile';
import isGroupChat from '../utils/isGroupChat';
import type {
  WebviewActionContext,
  AppDataPush,
  NoteAddedPush,
  NoteDeletedPush,
  NoteUpdatedPush,
} from '../../types';

const handleWebviewAction = makeContainer({
  deps: [NoteController, useUserProfile] as const,
})(
  (noteController, getUserProfile) =>
    async ({
      bot,
      event,
      metadata: {
        connection,
        auth: { platform, channel: chat, user },
      },
    }: WebviewActionContext) => {
      if (event.type === 'connect') {
        const [{ profile }, noteState] = await Promise.all([
          getUserProfile(user, chat),
          noteController.getNoteData(chat),
        ]);

        const appData: AppDataPush = {
          category: 'webview_push',
          type: 'app_data',
          payload: {
            platform,
            profile,
            isGroupChat: isGroupChat(chat),
            notes: noteState?.notes || [],
          },
        };

        return Promise.all([
          bot.subscribeTopic(connection, chat.uid),
          bot.send(connection, appData),
        ]);
      }

      if (event.type === 'add_note') {
        const { title, content } = event.payload;
        const { note } = await noteController.addNote(
          chat,
          user,
          title,
          content
        );

        const notification: NoteAddedPush = {
          category: 'webview_push',
          type: 'note_added',
          payload: { note },
        };

        return bot.sendTopic(chat.uid, notification);
      }

      if (event.type === 'delete_note') {
        const { id } = event.payload;
        const { note } = await noteController.deleteNote(chat, id);

        if (note) {
          const notification: NoteDeletedPush = {
            category: 'webview_push',
            type: 'note_deleted',
            payload: { id },
          };

          await bot.sendTopic(chat.uid, notification);
        }
        return;
      }

      if (event.type === 'update_note') {
        const { id, title, content } = event.payload;
        const { note } = await noteController.updateNote(
          chat,
          id,
          title,
          content
        );

        if (note) {
          const notification: NoteUpdatedPush = {
            category: 'webview_push',
            type: 'note_updated',
            payload: { note },
          };

          await bot.sendTopic(chat.uid, notification);
        }
        return;
      }
    }
);

export default handleWebviewAction;
