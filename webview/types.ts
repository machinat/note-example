import { ConnectEventValue, DisconnectEventValue } from '@machinat/webview';
import WebviewClient, { ClientEventContext } from '@machinat/webview/client';
import { MessengerClientAuthenticator } from '@machinat/messenger/webview';
import { LineClientAuthenticator } from '@machinat/line/webview';
import { TelegramClientAuthenticator } from '@machinat/telegram/webview';
import { WebviewPush } from '../src/types';

export type { AppData, NoteData } from '../src/types';

export type ClientAuthenticator =
  | MessengerClientAuthenticator
  | TelegramClientAuthenticator
  | LineClientAuthenticator;

export type WebAppClient = WebviewClient<ClientAuthenticator, WebviewPush>;

export type WebAppEventContext = ClientEventContext<
  ClientAuthenticator,
  ConnectEventValue | DisconnectEventValue | WebviewPush
>;
