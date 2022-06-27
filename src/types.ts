import type { SociablyProfile } from '@sociably/core';
import type { MessengerEventContext } from '@sociably/messenger';
import type MessengerAuth from '@sociably/messenger/webview';
import type { TelegramEventContext } from '@sociably/telegram';
import type TelegramAuth from '@sociably/telegram/webview';
import type { LineEventContext } from '@sociably/line';
import type LineAuth from '@sociably/line/webview';
import type {
  WebviewEventContext,
  ConnectEventValue,
  DisconnectEventValue,
} from '@sociably/webview';
import type {
  INTENT_OK,
  INTENT_NO,
  INTENT_OPEN,
  INTENT_SHARE,
  INTENT_GREETING,
  INTENT_INTRODUCE,
  INTENT_UNKNOWN,
} from './constant';

export type NoteData = {
  authorId: string;
  id: number;
  title: string;
  content: string;
};

export type NoteDataState = {
  idCounter: number;
  notes: NoteData[];
};

export type AddNoteAction = {
  category: 'webview_action';
  type: 'add_note';
  payload: {
    chatUid: undefined | string;
    title: string;
    content: string;
  };
};

export type UpdateNoteAction = {
  category: 'webview_action';
  type: 'update_note';
  payload: {
    chatUid: undefined | string;
    id: number;
    title: string;
    content: string;
  };
};

export type DeleteNoteAction = {
  category: 'webview_action';
  type: 'delete_note';
  payload: {
    chatUid: undefined | string;
    id: number;
  };
};

export type WebviewAction =
  | AddNoteAction
  | UpdateNoteAction
  | DeleteNoteAction
  | ConnectEventValue
  | DisconnectEventValue;

export type WebviewActionContext<
  EventValue extends WebviewAction = WebviewAction
> = WebviewEventContext<MessengerAuth | TelegramAuth | LineAuth, EventValue>;

export type ChatEventContext =
  | MessengerEventContext
  | TelegramEventContext
  | LineEventContext;

export type AppEventContext = ChatEventContext | WebviewActionContext;

export type NoteAddedPush = {
  category: 'webview_push';
  type: 'note_added';
  payload: {
    note: NoteData;
  };
};

export type NoteUpdatedPush = {
  category: 'webview_push';
  type: 'note_updated';
  payload: {
    note: NoteData;
  };
};

export type NoteDeletedPush = {
  category: 'webview_push';
  type: 'note_deleted';
  payload: {
    id: number;
  };
};

export type AppData = {
  platform: 'line' | 'messenger' | 'telegram';
  profile: null | SociablyProfile;
  isGroupChat: boolean;
  notes: NoteData[];
};

export type AppDataPush = {
  category: 'webview_push';
  type: 'app_data';
  payload: AppData;
};

export type WebviewPush =
  | NoteAddedPush
  | NoteUpdatedPush
  | NoteDeletedPush
  | AppDataPush;

export type AppIntentType =
  | typeof INTENT_OK
  | typeof INTENT_NO
  | typeof INTENT_OPEN
  | typeof INTENT_SHARE
  | typeof INTENT_GREETING
  | typeof INTENT_INTRODUCE
  | typeof INTENT_UNKNOWN;
