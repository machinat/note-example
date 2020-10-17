import Machinat from '@machinat/core';
import HTTP from '@machinat/http';

import Messenger from '@machinat/messenger';
import { MessengerServerAuthorizer } from '@machinat/messenger/auth';
import {
  MessengerAssetsManager,
  saveReusableAttachments,
} from '@machinat/messenger/asset';

import Line from '@machinat/line';
import { LineServerAuthorizer } from '@machinat/line/auth';
import { LineAssetsManager } from '@machinat/line/asset';

import WebSocket from '@machinat/websocket';
import Auth from '@machinat/auth';
import RedisState from '@machinat/redis-state';
import { FileState } from '@machinat/simple-state';
import Next from '@machinat/next';
import { useAuthController } from '@machinat/websocket/auth';
import DialogFlow from '@machinat/dialogflow';
import YAML from 'yaml';

import Script from '@machinat/script';
import FirstMeet from './scenes/FirstMeet';
import Introduction from './scenes/Introduction';

import {
  ENTRY_URL_I,
  FB_PAGE_NAME_I,
  LINE_LIFF_ID_I,
  LINE_OFFICIAL_ACCOUNT_ID_I,
} from './interface';
import nextConfig from './webview/next.config.js';

const {
  // location
  PORT,
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
  // dialogflow
  GOOGLE_APPLICATION_CREDENTIALS,
  DIALOG_FLOW_PROJECT_ID,
  DIALOG_FLOW_CLIENT_EMAIL,
  DIALOG_FLOW_PRIVATE_KEY,
  // redis
  REDIS_URL,
} = process.env;

const DEV = NODE_ENV !== 'production';

const ORIGIN = new URL(ENTRY_URL as string).origin;

const app = Machinat.createApp({
  modules: [
    HTTP.initModule({
      port: PORT ? Number(PORT) : 8080,
    }),

    Auth.initModule({
      entryPath: '/auth',
      secret: AUTH_SECRET as string,
      secure: !DEV,
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
      libs: [FirstMeet, Introduction],
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

    Next.initModule({
      entryPath: '/webview',
      nextAppOptions: {
        dev: DEV,
        dir: `./${DEV ? 'src' : 'lib'}/webview`,
        conf: nextConfig,
      },
    }),
  ],

  platforms: [
    Messenger.initModule({
      entryPath: '/webhook/messenger',
      pageId: MESSENGER_PAGE_ID as string,
      appSecret: MESSENGER_APP_SECRET,
      accessToken: MESSENGER_ACCESS_TOKEN as string,
      verifyToken: MESSENGER_VERIFY_TOKEN,
      dispatchMiddlewares: [saveReusableAttachments],
    }),

    Line.initModule({
      entryPath: '/webhook/line',
      providerId: LINE_PROVIDER_ID as string,
      channelId: LINE_BOT_CHANNEL_ID as string,
      accessToken: LINE_ACCESS_TOKEN as string,
      channelSecret: LINE_CHANNEL_SECRET,
      liffChannelIds: [(LINE_LIFF_ID as string).split('-')[0]],
    }),

    WebSocket.initModule({
      entryPath: '/websocket',
      verifyUpgrade(request) {
        return request.headers.origin === ORIGIN;
      },
    }),
  ],

  bindings: [
    LineAssetsManager,
    { provide: Auth.AUTHORIZERS_I, withProvider: LineServerAuthorizer },

    MessengerAssetsManager,
    { provide: Auth.AUTHORIZERS_I, withProvider: MessengerServerAuthorizer },

    { provide: WebSocket.LOGIN_VERIFIER_I, withProvider: useAuthController },

    { provide: FileState.SerializerI, withValue: YAML },

    { provide: ENTRY_URL_I, withValue: ENTRY_URL },
    { provide: FB_PAGE_NAME_I, withValue: MESSENGER_PAGE_ID },
    { provide: LINE_LIFF_ID_I, withValue: LINE_LIFF_ID },
    {
      provide: LINE_OFFICIAL_ACCOUNT_ID_I,
      withValue: LINE_OFFICIAL_ACCOUNT_ID,
    },
  ],
});

export default app;
