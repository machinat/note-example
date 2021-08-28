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
import { FileState } from '@machinat/local-state';
import RedisState from '@machinat/redis-state';
import DialogFlow from '@machinat/dialogflow';
import Script from '@machinat/script';
import Guide from './scenes/Guide';
import Introduction from './scenes/Introduction';
import NoteController from './services/NoteController';
import useIntent from './services/useIntent';
import useUserProfile from './services/useUserProfile';
import nextConfigs from '../webview/next.config.js';

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
  MESSENGER_APP_ID,
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
          path: './.state_data.json',
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
      MessengerAuthorizer | LineAuthorizer | TelegramAuthorizer,
      WebviewAction
    >({
      webviewHost: DOMAIN,
      webviewPath: '/webview',
      authSecret: WEBVIEW_AUTH_SECRET,
      sameSite: 'none',
      nextServerOptions: {
        dev: DEV,
        dir: './webview',
        conf: {
          ...nextConfigs,
          publicRuntimeConfig: {
            isProduction: NODE_ENV === 'production',
            messengerAppId: MESSENGER_APP_ID,
            lineProviderId: LINE_PROVIDER_ID,
            lineBotChannelId: LINE_CHANNEL_ID,
            lineLiffId: LINE_LIFF_ID,
          },
        },
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
