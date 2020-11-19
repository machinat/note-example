import { GetAuthContextOf } from '@machinat/auth/types';

import { MessengerChat, MessengerUser } from '@machinat/messenger';
import { MessengerServerAuthorizer } from '@machinat/messenger/auth';
import { MessengerEventContext } from '@machinat/messenger/types';

import { TelegramChat, TelegramUser } from '@machinat/telegram';
import { TelegramServerAuthorizer } from '@machinat/telegram/auth';
import { TelegramEventContext } from '@machinat/telegram/types';

import { LineChat, LineUser } from '@machinat/line';
import { LineServerAuthorizer } from '@machinat/line/auth';
import { LineEventContext } from '@machinat/line/types';
import {
  WebSocketMetadata,
  WebSocketEventContext,
} from '@machinat/websocket/types';

export type NoteData = { id: number; title: string; content: string };
export type SpaceData = {
  beginTime: number;
  idCounter: number;
  notes: NoteData[];
};

export type AddNote = {
  kind: 'note_operation';
  type: 'add_note';
  payload: {
    title: string;
    content: string;
  };
};

export type UpdateNote = {
  kind: 'note_operation';
  type: 'update_note';
  payload: NoteData;
};

export type DeleteNote = {
  kind: 'note_operation';
  type: 'delete_note';
  payload: {
    id: number;
  };
};

export type WebviewClose = {
  kind: 'app';
  type: 'webview_close';
  payload: void;
};

export type ConnectionConnect = {
  kind: 'connection';
  type: 'connect';
  payload: void;
};

export type ConnectionDisconnect = {
  kind: 'connection';
  type: 'disconnect';
  payload: void;
};

export type WebViewActivity =
  | AddNote
  | UpdateNote
  | DeleteNote
  | WebviewClose
  | ConnectionConnect
  | ConnectionDisconnect;

export type AppWebSocketEventContext = WebSocketEventContext<
  WebViewActivity,
  MessengerUser | LineUser,
  GetAuthContextOf<
    MessengerServerAuthorizer | TelegramServerAuthorizer | LineServerAuthorizer
  >
>;

export type AppEventContext =
  | MessengerEventContext
  | TelegramEventContext
  | LineEventContext
  | AppWebSocketEventContext;

export type WebViewEventContext<Activity = WebViewActivity> =
  | (Omit<MessengerEventContext, 'event' | 'metadata'> & {
      metadata: WebSocketMetadata<GetAuthContextOf<MessengerServerAuthorizer>>;
      event: Activity & { channel: MessengerChat; user: MessengerUser };
    })
  | (Omit<LineEventContext, 'event' | 'metadata'> & {
      metadata: WebSocketMetadata<GetAuthContextOf<LineServerAuthorizer>>;
      event: Activity & { channel: LineChat; user: LineUser };
    });

export type NoteAddedNotification = {
  kind: 'notification';
  type: 'note_added';
  payload: NoteData;
};

export type NoteUpdatedNotification = {
  kind: 'notification';
  type: 'note_updated';
  payload: NoteData;
};

export type NoteDeletedNotification = {
  kind: 'notification';
  type: 'note_deleted';
  payload: {
    id: number;
  };
};

export type AppDataNotification = {
  kind: 'app';
  type: 'app_data';
  payload: {
    spaceType: 'own' | 'chat' | 'group';
    profile: {
      platform: 'line' | 'messenger';
      name: string;
      pictureURL: string;
    };
    notes: NoteData[];
  };
};
