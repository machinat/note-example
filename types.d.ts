import type { MachinatProfile } from '@machinat/core';
import type { MessengerEventContext } from '@machinat/messenger';
import type { MessengerServerAuthorizer } from '@machinat/messenger/webview';
import type { TelegramEventContext } from '@machinat/telegram';
import type { TelegramServerAuthorizer } from '@machinat/telegram/webview';
import type { LineEventContext } from '@machinat/line';
import type { LineServerAuthorizer } from '@machinat/line/webview';
import type {
  WebviewEventContext,
  ConnectEventValue,
  DisconnectEventValue,
} from '@machinat/webview';
import type {
  INTENT_OK,
  INTENT_NO,
  INTENT_OPEN,
  INTENT_SHARE,
  INTENT_GREETING,
  INTENT_INTRODUCE,
  INTENT_UNKNOWN,
} from './src/constant';

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
> = WebviewEventContext<
  MessengerServerAuthorizer | TelegramServerAuthorizer | LineServerAuthorizer,
  EventValue
>;

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
  profile: MachinatProfile;
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
