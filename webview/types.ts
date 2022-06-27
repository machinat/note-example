import { ConnectEventValue, DisconnectEventValue } from '@sociably/webview';
import WebviewClient, { ClientEventContext } from '@sociably/webview/client';
import MessengerWebviewAuth from '@sociably/messenger/webview/client';
import LineWebviewAuth from '@sociably/line/webview/client';
import TelegramWebviewAuth from '@sociably/telegram/webview/client';
import { WebviewPush } from '../src/types';

export type { WebviewPush, AppData, NoteData } from '../src/types';

export type WebviewAuth =
  | MessengerWebviewAuth
  | TelegramWebviewAuth
  | LineWebviewAuth;

export type WebAppClient = WebviewClient<WebviewAuth, WebviewPush>;

export type WebAppEventContext = ClientEventContext<
  WebviewAuth,
  ConnectEventValue | DisconnectEventValue | WebviewPush
>;
