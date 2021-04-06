import fs from 'fs';
import axios from 'axios';
import type { MachinatApp } from '@machinat/core/types';
import Messenger from '@machinat/messenger';
import Telegram from '@machinat/telegram';
import Line from '@machinat/line';
import LineAssetsManager from '@machinat/line/asset';
import encodePostbackData from '../utils/encodePostbackData';
import { MESSENGER_START_ACTION } from '../constant';

const {
  HOST,
  LINE_LIFF_ID,
  TELEGRAM_SECRET_PATH,
  LINE_ACCESS_TOKEN,
} = process.env;

const ENTRY_URL = `https://${HOST}`;

export const up = async ({ context: { app } }) => {
  const [
    messengerBot,
    telegramBot,
    lineBot,
    lineAssetManager,
  ] = (app as MachinatApp<any>).useServices([
    Messenger.Bot,
    Telegram.Bot,
    Line.Bot,
    LineAssetsManager,
  ] as const);

  await messengerBot.makeApiCall('POST', 'me/messenger_profile', {
    whitelisted_domains: [ENTRY_URL],
    get_started: {
      payload: encodePostbackData({ action: MESSENGER_START_ACTION }),
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
            title: '📝 Open Notes',
            url: `${ENTRY_URL}?platform=messenger`,
            webview_height_ratio: 'full',
            messenger_extensions: true,
          },
          {
            type: 'postback',
            title: '📤 Share',
            payload: encodePostbackData({ action: 'share' }),
          },
        ],
      },
    ],
  });

  await telegramBot.makeApiCall('setWebhook', {
    url: `${ENTRY_URL}/webhook/telegram/${TELEGRAM_SECRET_PATH}`,
  });

  await telegramBot.makeApiCall('setMyCommands', {
    commands: [{ command: 'note', description: 'Open notes' }],
  });

  const richMenuId = await lineAssetManager.createRichMenu('default_menu.en', {
    size: {
      width: 2000,
      height: 250,
    },
    selected: false,
    name: 'default_menu.en',
    chatBarText: 'Open Notes',
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1000, height: 250 },
        action: {
          type: 'uri',
          uri: `https://liff.line.me/${LINE_LIFF_ID}?platform=line`,
        },
      },
      {
        bounds: { x: 1000, y: 0, width: 1000, height: 250 },
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
    data: fs.createReadStream('./assets/line_menu.jpg'),
  });

  await lineBot.makeApiCall(
    'POST',
    `v2/bot/user/all/richmenu/${richMenuId}`,
    null
  );
};

export const down = async ({ context: { app } }) => {
  const [
    messengerBot,
    telegramBot,
    lineAssetManager,
  ] = (app as MachinatApp<any>).useServices([
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

  await telegramBot.makeApiCall('deleteWebhook');
  await telegramBot.makeApiCall('setMyCommands', { commands: [] });

  await lineAssetManager.deleteRichMenu('default_menu.en');
};
