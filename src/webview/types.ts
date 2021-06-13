import {
  WebviewEvent,
  ConnectEventValue,
  DisconnectEventValue,
} from '@machinat/webview';
import WebviewClient from '@machinat/webview/client';
import { UserOfAuthorizer } from '@machinat/auth';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { WebviewNotif } from '../types';

export type ClientAuthorizer =
  | MessengerClientAuthorizer
  | TelegramClientAuthorizer
  | LineClientAuthorizer;

export type AppWebviewClient = WebviewClient<ClientAuthorizer, WebviewNotif>;

export type AppWeviewEvent = WebviewEvent<
  ConnectEventValue | DisconnectEventValue | WebviewNotif,
  UserOfAuthorizer<ClientAuthorizer>
>;
