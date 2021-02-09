import Machinat from '@machinat/core';
import HTTP from '@machinat/http';

import Messenger from '@machinat/messenger';
import MessengerAuthorizer from '@machinat/messenger/webview';
import MessengerAssetsManager, {
  saveReusableAttachments,
} from '@machinat/messenger/asset';

import Line from '@machinat/line';
import LineAuthorizer from '@machinat/line/webview';
import LineAssetsManager from '@machinat/line/asset';

import Telegram from '@machinat/telegram';
import TelegramAssetsManager from '@machinat/telegram/asset';
import TelegramAuthorizer from '@machinat/telegram/webview';

import Webview from '@machinat/webview';
import RedisState from '@machinat/redis-state';
import { FileState } from '@machinat/local-state';
import DialogFlow from '@machinat/dialogflow';
import YAML from 'yaml';

import Script from '@machinat/script';
import Starting from './scenes/Starting';
import Introduction from './scenes/Introduction';

import {
  ENTRY_URL_I,
  FB_PAGE_NAME_I,
  TELEGRAM_BOT_NAME_I,
  LINE_LIFF_ID_I,
  LINE_CHANNEL_ID_I,
  LINE_OFFICIAL_ACCOUNT_ID_I,
} from './constant';
import type { WebViewActivity } from './types';
import nextConfig from './webview/next.config.js';

const {
  // location
  PORT,
  HOST,
  NODE_ENV,
  ENTRY_URL,
  // auth
  AUTH_SECRET,
  // messenger
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  // line
  LINE_PROVIDER_ID,
  LINE_BOT_CHANNEL_ID,
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
  // redis
  REDIS_URL,
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
          path: './.state_storage',
        })
      : RedisState.initModule({
          clientOptions: {
            url: REDIS_URL as string,
          },
        }),

    Script.initModule({
      libs: [Starting, Introduction],
    }),

    DialogFlow.initModule({
      projectId: DIALOG_FLOW_PROJECT_ID as string,
      gcpAuthConfig: GOOGLE_APPLICATION_CREDENTIALS
        ? undefined
        : {
            credentials: {
              client_email: DIALOG_FLOW_CLIENT_EMAIL,
              private_key: DIALOG_FLOW_PRIVATE_KEY,
            },
          },
      defaultLanguageCode: 'en-US',
    }),
  ],

  platforms: [
    Messenger.initModule({
      entryPath: '/webhook/messenger',
      pageId: MESSENGER_PAGE_ID as string,
      appSecret: MESSENGER_APP_SECRET,
      accessToken: MESSENGER_ACCESS_TOKEN,
      verifyToken: MESSENGER_VERIFY_TOKEN,
      dispatchMiddlewares: [saveReusableAttachments],
    }),

    Telegram.initModule({
      botToken: TELEGRAM_BOT_TOKEN,
      entryPath: '/webhook/telegram',
      secretPath: TELEGRAM_SECRET_PATH,
    }),

    Line.initModule({
      entryPath: '/webhook/line',
      providerId: LINE_PROVIDER_ID,
      channelId: LINE_BOT_CHANNEL_ID,
      accessToken: LINE_ACCESS_TOKEN,
      channelSecret: LINE_CHANNEL_SECRET,
      liffChannelIds: [LINE_LIFF_ID.split('-')[0]],
    }),

    Webview.initModule<
      MessengerAuthorizer | LineAuthorizer | TelegramAuthorizer,
      WebViewActivity
    >({
      webviewHost: HOST,
      authSecret: AUTH_SECRET,
      sameSite: 'none',
      nextServerOptions: {
        dev: DEV,
        dir: `./${DEV ? 'src' : 'lib'}/webview`,
        conf: nextConfig,
      },
    }),
  ],

  services: [
    LineAssetsManager,
    { provide: Webview.AuthorizerList, withProvider: LineAuthorizer },

    MessengerAssetsManager,
    {
      provide: Webview.AuthorizerList,
      withProvider: MessengerAuthorizer,
    },

    TelegramAssetsManager,
    { provide: Webview.AuthorizerList, withProvider: TelegramAuthorizer },

    { provide: FileState.Serializer, withValue: YAML },

    { provide: ENTRY_URL_I, withValue: ENTRY_URL },
    { provide: FB_PAGE_NAME_I, withValue: MESSENGER_PAGE_ID },
    { provide: TELEGRAM_BOT_NAME_I, withValue: TELEGRAM_BOT_NAME },
    { provide: LINE_CHANNEL_ID_I, withValue: LINE_BOT_CHANNEL_ID },
    { provide: LINE_LIFF_ID_I, withValue: LINE_LIFF_ID },
    {
      provide: LINE_OFFICIAL_ACCOUNT_ID_I,
      withValue: LINE_OFFICIAL_ACCOUNT_ID,
    },
  ],
});

export default app;
