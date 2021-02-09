import fs from 'fs';
import axios from 'axios';
import type { MachinatApp } from '@machinat/core/types';
import Messenger from '@machinat/messenger';
import Telegram from '@machinat/telegram';
import Line from '@machinat/line';
import LineAssetsManager from '@machinat/line/asset';
import { encodePostbackData } from '../utils';

const {
  ENTRY_URL,
  LINE_LIFF_ID,
  TELEGRAM_SECRET_PATH,
  LINE_ACCESS_TOKEN,
} = process.env;

export const up = async (app: MachinatApp<any>) => {
  const [
    messengerBot,
    telegramBot,
    lineBot,
    lineAssetManager,
  ] = app.useServices([
    Messenger.Bot,
    Telegram.Bot,
    Line.Bot,
    LineAssetsManager,
  ] as const);

  await messengerBot.makeApiCall('POST', 'me/messenger_profile', {
    whitelisted_domains: [ENTRY_URL],
    get_started: {
      payload: '__GET_STARTED__',
    },
    greeting: [
      {
        locale: 'default',
        text: 'Take notes within your chatrooms!',
      },
    ],
  });

  await messengerBot.makeApiCall('POST', 'me/messenger_profile', {
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: 'web_url',
            title: '👤 My Space',
            url: `${ENTRY_URL}/webview?platform=messenger`,
            webview_height_ratio: 'full',
            messenger_extensions: true,
          },
          {
            type: 'postback',
            title: '👥 Use w/ Friends',
            payload: encodePostbackData({ action: 'share' }),
          },
        ],
      },
    ],
  });

  telegramBot.makeApiCall('setWebhook', {
    url: `${ENTRY_URL}/webhook/telegram/${TELEGRAM_SECRET_PATH}`,
  });

  const richMenuId = await lineAssetManager.createRichMenu('default_menu.en', {
    size: {
      width: 800,
      height: 250,
    },
    selected: false,
    name: 'default_menu.en',
    chatBarText: 'Open Notes',
    areas: [
      {
        bounds: { x: 0, y: 0, width: 367, height: 250 },
        action: {
          type: 'uri',
          uri: `https://liff.line.me/${LINE_LIFF_ID}/webview?platform=line&fromBotChannel=true`,
        },
      },
      {
        bounds: { x: 367, y: 0, width: 433, height: 250 },
        action: {
          type: 'postback',
          data: encodePostbackData({ action: 'share' }),
        },
      },
    ],
  });

  await axios({
    method: 'post',
    url: `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
    headers: {
      Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
      'Content-Type': 'image/png',
    },
    data: fs.createReadStream('./assets/line_menu.en.png'),
  });

  await lineBot.makeApiCall(
    'POST',
    `v2/bot/user/all/richmenu/${richMenuId}`,
    null
  );
};

export const down = async (app: MachinatApp<any>) => {
  const [messengerBot, telegramBot, lineAssetManager] = app.useServices([
    Messenger.Bot,
    Telegram.Bot,
    LineAssetsManager,
  ] as const);

  await messengerBot.makeApiCall('DELETE', 'me/messenger_profile', {
    fields: [
      'get_started',
      'greeting',
      'persistent_menu',
      'whitelisted_domains',
    ],
  });

  telegramBot.makeApiCall('deleteWebhook');

  await lineAssetManager.deleteRichMenu('default_menu.en');
};
