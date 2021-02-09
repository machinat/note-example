import type { MessengerServerAuthorizer } from '@machinat/messenger/webview';
import type { MessengerEventContext } from '@machinat/messenger/types';

import type { TelegramServerAuthorizer } from '@machinat/telegram/webview';
import type { TelegramEventContext } from '@machinat/telegram/types';

import type { LineServerAuthorizer } from '@machinat/line/webview';
import type { LineEventContext } from '@machinat/line/types';

import type { WebviewEventContext } from '@machinat/webview/types';
import type {
  ConnectEventValue,
  DisconnectEventValue,
} from '@machinat/websocket/types';

export type NoteData = { id: number; title: string; content: string };

export type ChannelState = {
  chatBeginAt: undefined | number;
  idCounter: number;
  notes: NoteData[];
};

export type AddNoteActivity = {
  kind: 'note_action';
  type: 'add_note';
  payload: {
    title: string;
    content: string;
  };
};

export type UpdateNoteActivity = {
  kind: 'note_action';
  type: 'update_note';
  payload: NoteData;
};

export type DeleteNoteActivity = {
  kind: 'note_action';
  type: 'delete_note';
  payload: {
    id: number;
  };
};

export type WebviewCloseActivity = {
  kind: 'app_action';
  type: 'webview_close';
  payload: void;
};

export type SwitchNoteChannelActivity = {
  kind: 'app_action';
  type: 'switch_channel';
  payload: {
    uid: string;
  };
};

export type WebViewActivity =
  | AddNoteActivity
  | UpdateNoteActivity
  | DeleteNoteActivity
  | SwitchNoteChannelActivity
  | WebviewCloseActivity
  | ConnectEventValue
  | DisconnectEventValue;

export type WebAppEventContext<
  EventValue extends WebViewActivity = WebViewActivity
> = WebviewEventContext<
  MessengerServerAuthorizer | TelegramServerAuthorizer | LineServerAuthorizer,
  EventValue
>;

export type AppEventContext =
  | MessengerEventContext
  | TelegramEventContext
  | LineEventContext
  | WebAppEventContext;

export type NoteAddedNotification = {
  kind: 'app_data';
  type: 'note_added';
  payload: NoteData;
};

export type NoteUpdatedNotification = {
  kind: 'app_data';
  type: 'note_updated';
  payload: NoteData;
};

export type NoteDeletedNotification = {
  kind: 'app_data';
  type: 'note_deleted';
  payload: {
    id: number;
  };
};

type ChannelMember = {
  uid: string;
  name: string;
  avatar?: string;
};

export type UserData = {
  kind: 'app_data';
  type: 'user_data';
  payload: {
    platform: 'line' | 'messenger' | 'telegram';
    profile: ChannelMember;
    channels: Array<{
      uid: string;
      name: string;
      members: ChannelMember[];
    }>;
  };
};

export type ChannelData = {
  kind: 'app_data';
  type: 'channel_data';
  payload: {
    spaceType: 'private' | 'chat' | 'group';
    notes: NoteData[];
    members: ChannelMember[];
  };
};
