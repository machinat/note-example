import { ConnectEventValue, DisconnectEventValue } from '@machinat/webview';
import WebviewClient, { ClientEventContext } from '@machinat/webview/client';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { WebviewPush } from '../types';

export type ClientAuthorizer =
  | MessengerClientAuthorizer
  | TelegramClientAuthorizer
  | LineClientAuthorizer;

export type WebAppClient = WebviewClient<ClientAuthorizer, WebviewPush>;

export type WebAppEventContext = ClientEventContext<
  ClientAuthorizer,
  ConnectEventValue | DisconnectEventValue | WebviewPush
>;
