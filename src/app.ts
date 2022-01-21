import Machinat from '@machinat/core';
import HTTP from '@machinat/http';
import Messenger from '@machinat/messenger';
import MessengerAuthenticator from '@machinat/messenger/webview';
import MessengerAssetsManager, {
  saveReusableAttachments,
} from '@machinat/messenger/asset';
import Line from '@machinat/line';
import LineAuthenticator from '@machinat/line/webview';
import LineAssetsManager from '@machinat/line/asset';
import Telegram from '@machinat/telegram';
import TelegramAssetsManager from '@machinat/telegram/asset';
import TelegramAuthenticator from '@machinat/telegram/webview';
import Webview from '@machinat/webview';
import { FileState } from '@machinat/dev-tools';
import RedisState from '@machinat/redis-state';
import DialogFlow from '@machinat/dialogflow';
import Script from '@machinat/script';
import nextConfigs from '../webview/next.config.js';
import recognitionData from './recognitionData';
import useIntent from './services/useIntent';
import useUserProfile from './services/useUserProfile';
import Guide from './scenes/Guide';
import Introduction from './scenes/Introduction';
import NoteController from './services/NoteController';

import {
  EntryUrl,
  FbPageName,
  TelegramBotName,
  LineLiffId,
  LineChannelId,
  LineOfficialAccountId,
} from './interface';
import type { WebviewAction } from './types';

const {
  // location
  PORT,
  DOMAIN,
  NODE_ENV,
  REDIS_URL,
  // webview
  WEBVIEW_AUTH_SECRET,
  // messenger
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  // line
  LINE_PROVIDER_ID,
  LINE_CHANNEL_ID,
  LINE_OFFICIAL_ACCOUNT_ID,
  LINE_ACCESS_TOKEN,
  LINE_CHANNEL_SECRET,
  LINE_LIFF_ID,
  // telegram
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_BOT_NAME,
  TELEGRAM_SECRET_PATH,
  // dialogflow
  GOOGLE_APPLICATION_CREDENTIALS,
  DIALOG_FLOW_PROJECT_ID,
  DIALOG_FLOW_CLIENT_EMAIL,
  DIALOG_FLOW_PRIVATE_KEY,
} = process.env as Record<string, string>;

const DEV = NODE_ENV !== 'production';

const app = Machinat.createApp({
  modules: [
    HTTP.initModule({
      listenOptions: {
        port: PORT ? Number(PORT) : 8080,
      },
    }),

    DEV
      ? FileState.initModule({
          path: './.state_storage.json',
        })
      : RedisState.initModule({
          clientOptions: {
            url: REDIS_URL,
          },
        }),

    Script.initModule({
      libs: [Guide, Introduction],
    }),

    DialogFlow.initModule({
      recognitionData,
      projectId: DIALOG_FLOW_PROJECT_ID,
      environment: `note-example-${DEV ? 'dev' : 'prod'}`,
      clientOptions: GOOGLE_APPLICATION_CREDENTIALS
        ? undefined
        : {
            credentials: {
              client_email: DIALOG_FLOW_CLIENT_EMAIL,
              private_key: DIALOG_FLOW_PRIVATE_KEY,
            },
          },
    }),
  ],

  platforms: [
    Messenger.initModule({
      webhookPath: '/webhook/messenger',
      pageId: Number(MESSENGER_PAGE_ID),
      appSecret: MESSENGER_APP_SECRET,
      accessToken: MESSENGER_ACCESS_TOKEN,
      verifyToken: MESSENGER_VERIFY_TOKEN,
      dispatchMiddlewares: [saveReusableAttachments],
    }),

    Telegram.initModule({
      botToken: TELEGRAM_BOT_TOKEN,
      webhookPath: '/webhook/telegram',
      secretPath: TELEGRAM_SECRET_PATH,
    }),

    Line.initModule({
      webhookPath: '/webhook/line',
      providerId: LINE_PROVIDER_ID,
      channelId: LINE_CHANNEL_ID,
      accessToken: LINE_ACCESS_TOKEN,
      channelSecret: LINE_CHANNEL_SECRET,
      liffChannelIds: [LINE_LIFF_ID.split('-')[0]],
    }),

    Webview.initModule<
      MessengerAuthenticator | LineAuthenticator | TelegramAuthenticator,
      WebviewAction
    >({
      webviewHost: DOMAIN,
      webviewPath: '/webview',
      authSecret: WEBVIEW_AUTH_SECRET,
      sameSite: 'none',
      nextServerOptions: {
        dev: DEV,
        dir: './webview',
        conf: nextConfigs,
      },
    }),
  ],

  services: [
    LineAssetsManager,
    { provide: Webview.AuthenticatorList, withProvider: LineAuthenticator },

    MessengerAssetsManager,
    {
      provide: Webview.AuthenticatorList,
      withProvider: MessengerAuthenticator,
    },

    TelegramAssetsManager,
    { provide: Webview.AuthenticatorList, withProvider: TelegramAuthenticator },

    { provide: EntryUrl, withValue: `https://${DOMAIN}` },
    { provide: FbPageName, withValue: MESSENGER_PAGE_ID },
    { provide: TelegramBotName, withValue: TELEGRAM_BOT_NAME },
    { provide: LineChannelId, withValue: LINE_CHANNEL_ID },
    { provide: LineLiffId, withValue: LINE_LIFF_ID },
    {
      provide: LineOfficialAccountId,
      withValue: LINE_OFFICIAL_ACCOUNT_ID,
    },
    NoteController,
    useIntent,
    useUserProfile,
  ],
});

export default app;
