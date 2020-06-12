import Machinat from '@machinat/core';
import HTTP from '@machinat/http';

import Messenger from '@machinat/messenger';
import MessengerAuthorizer from '@machinat/messenger/auth';
import MessengerAssetManager, {
  collectSharableAttachments,
} from '@machinat/messenger/asset';

import Line from '@machinat/line';
import LineAuthorizer from '@machinat/line/auth';
import LineAssetManager from '@machinat/line/asset';

import Auth from '@machinat/auth';
import FileState from '@machinat/state/file';
import YAML from 'yaml';
import Next from '@machinat/next';
import WebSocket from '@machinat/websocket';
import useAuthController from '@machinat/websocket/auth';
import DialogFlow from '@machinat/dialogflow';

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
  PORT,
  NODE_ENV,
  ENTRY_URL,
  ORIGINS,
  AUTH_SECRET,
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  LINE_PROVIDER_ID,
  LINE_BOT_CHANNEL_ID,
  LINE_OFFICIAL_ACCOUNT_ID,
  LINE_ACCESS_TOKEN,
  LINE_CHANNEL_SECRET,
  LINE_LIFF_ID,
  DIALOG_FLOW_PROJECT_ID,
  DIALOG_FLOW_CLIENT_EMAIL,
  DIALOG_FLOW_PRIVATE_KEY,
} = process.env;

const DEV = NODE_ENV !== 'production';

const origins = ORIGINS.split(/\s*,\s*/);

const app = Machinat.createApp({
  modules: [
    HTTP.initModule({
      port: PORT,
    }),

    Auth.initModule({
      entryPath: '/auth',
      secret: AUTH_SECRET,
      secure: !DEV,
    }),

    FileState.initModule({
      path: './.state_storage',
    }),

    Script.initModule({
      libs: [FirstMeet, Introduction],
    }),

    DialogFlow.initModule({
      projectId: DIALOG_FLOW_PROJECT_ID,
      gcpAuthConfig: {
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
      webhookPath: '/webhook/messenger',
      pageId: MESSENGER_PAGE_ID,
      appSecret: MESSENGER_APP_SECRET,
      accessToken: MESSENGER_ACCESS_TOKEN,
      verifyToken: MESSENGER_VERIFY_TOKEN,
      dispatchMiddlewares: [collectSharableAttachments],
    }),

    Line.initModule({
      webhookPath: '/webhook/line',
      providerId: LINE_PROVIDER_ID,
      botChannelId: LINE_BOT_CHANNEL_ID,
      accessToken: LINE_ACCESS_TOKEN,
      channelSecret: LINE_CHANNEL_SECRET,
      liffChannelIds: [LINE_LIFF_ID.split('-')[0]],
    }),

    WebSocket.initModule({
      entryPath: '/websocket',
      verifyUpgrade(request) {
        return origins.includes(request.headers.origin);
      },
    }),
  ],

  bindings: [
    LineAssetManager,
    { provide: Auth.AUTHORIZERS_I, withProvider: LineAuthorizer },

    MessengerAssetManager,
    { provide: Auth.AUTHORIZERS_I, withProvider: MessengerAuthorizer },

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
