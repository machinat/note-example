import Machinat from '@machinat/core';
import HTTP from '@machinat/http';
import Messenger from '@machinat/messenger';
import MessengAuth from '@machinat/messenger/webview';
import Line from '@machinat/line';
import LineAuth from '@machinat/line/webview';
import LineAssetsManager from '@machinat/line/asset';
import Telegram from '@machinat/telegram';
import TelegramAuth from '@machinat/telegram/webview';
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
  FbPageName,
  TelegramBotName,
  LineOfficialAccountId,
} from './interface';
import type { WebviewAction } from './types';

const {
  // basic
  APP_NAME,
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

type CreateAppOptions = {
  noServer?: boolean;
};

const createApp = (options?: CreateAppOptions) => {
  return Machinat.createApp({
    modules: [
      HTTP.initModule({
        noServer: options?.noServer,
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
        pageId: MESSENGER_PAGE_ID,
        appSecret: MESSENGER_APP_SECRET,
        accessToken: MESSENGER_ACCESS_TOKEN,
        verifyToken: MESSENGER_VERIFY_TOKEN,
      }),

      Telegram.initModule({
        webhookPath: '/webhook/telegram',
        botName: TELEGRAM_BOT_NAME,
        botToken: TELEGRAM_BOT_TOKEN,
        secretPath: TELEGRAM_SECRET_PATH,
      }),

      Line.initModule({
        webhookPath: '/webhook/line',
        providerId: LINE_PROVIDER_ID,
        channelId: LINE_CHANNEL_ID,
        accessToken: LINE_ACCESS_TOKEN,
        channelSecret: LINE_CHANNEL_SECRET,
        liffId: LINE_LIFF_ID,
      }),

      Webview.initModule<MessengAuth | LineAuth | TelegramAuth, WebviewAction>({
        webviewHost: DOMAIN,
        webviewPath: '/webview',

        authSecret: WEBVIEW_AUTH_SECRET,
        authPlatforms: [MessengAuth, LineAuth, TelegramAuth],
        cookieSameSite: 'none',
        basicAuth: {
          appName: APP_NAME,
          appIconUrl: 'https://machinat.com/img/logo.jpg',
        },

        noNextServer: options?.noServer,
        nextServerOptions: {
          dev: DEV,
          dir: './webview',
          conf: nextConfigs,
        },
      }),
    ],

    services: [
      LineAssetsManager,

      { provide: FbPageName, withValue: MESSENGER_PAGE_ID },
      { provide: TelegramBotName, withValue: TELEGRAM_BOT_NAME },
      {
        provide: LineOfficialAccountId,
        withValue: LINE_OFFICIAL_ACCOUNT_ID,
      },
      NoteController,
      useIntent,
      useUserProfile,
    ],
  });
};

export default createApp;
