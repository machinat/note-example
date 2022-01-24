import { ConnectEventValue, DisconnectEventValue } from '@machinat/webview';
import WebviewClient, { ClientEventContext } from '@machinat/webview/client';
import MessengerWebviewAuth from '@machinat/messenger/webview/client';
import LineWebviewAuth from '@machinat/line/webview/client';
import TelegramWebviewAuth from '@machinat/telegram/webview/client';
import { WebviewPush } from '../src/types';

export type { AppData, NoteData } from '../src/types';

export type WebviewAuth =
  | MessengerWebviewAuth
  | TelegramWebviewAuth
  | LineWebviewAuth;

export type WebAppClient = WebviewClient<WebviewAuth, WebviewPush>;

export type WebAppEventContext = ClientEventContext<
  WebviewAuth,
  ConnectEventValue | DisconnectEventValue | WebviewPush
>;
