import fs from 'fs';
import axios from 'axios';
import { makeContainer } from '@sociably/core';
import Messenger from '@sociably/messenger';
import Telegram from '@sociably/telegram';
import Line from '@sociably/line';
import LineAssetsManager from '@sociably/line/asset';
import encodePostbackData from '../utils/encodePostbackData';
import { MESSENGER_START_ACTION } from '../constant';

const {
  DOMAIN,
  MESSENGER_APP_ID,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  MESSENGER_PAGE_ID,
  TELEGRAM_SECRET_PATH,
  LINE_ACCESS_TOKEN,
  LINE_LIFF_ID,
} = process.env;

const ENTRY_URL = `https://${DOMAIN}`;

export const up = makeContainer({
  deps: [Messenger.Bot, Telegram.Bot, Line.Bot, LineAssetsManager],
})(async (messengerBot, telegramBot, lineBot, lineAssetManager) => {
  // setup page profile in Messenger
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
            url: `${ENTRY_URL}/webview?platform=messenger`,
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

  // create Messenger webhook subscription, require running server in advance
  await messengerBot.makeApiCall('POST', `${MESSENGER_APP_ID}/subscriptions`, {
    access_token: `${MESSENGER_APP_ID}|${MESSENGER_APP_SECRET}`,
    object: 'page',
    callback_url: `${ENTRY_URL}/webhook/messenger`,
    fields: ['messages', 'messaging_postbacks'],
    include_values: true,
    verify_token: MESSENGER_VERIFY_TOKEN,
  });

  // add the page to Messenger webhook
  await messengerBot.makeApiCall('POST', 'me/subscribed_apps', {
    subscribed_fields: ['messages', 'messaging_postbacks'],
  });

  // setup webhook of the Telegram bot
  await telegramBot.makeApiCall('setWebhook', {
    url: `${ENTRY_URL}/webhook/telegram/${TELEGRAM_SECRET_PATH}`,
  });

  // add command for telegram bot
  await telegramBot.makeApiCall('setMyCommands', {
    commands: [{ command: 'note', description: 'Open notes' }],
  });

  // setup webhook of the LINE channel
  await lineBot.makeApiCall('PUT', 'v2/bot/channel/webhook/endpoint', {
    endpoint: `${ENTRY_URL}/webhook/line`,
  });

  // create line rich menu
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

  // upload rich menu image
  await axios({
    method: 'post',
    url: `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
    headers: {
      Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
      'Content-Type': 'image/png',
    },
    data: fs.createReadStream('./assets/line_menu.jpg'),
  });

  // set default rich menu
  await lineBot.makeApiCall(
    'POST',
    `v2/bot/user/all/richmenu/${richMenuId}`,
    null
  );
});

export const down = makeContainer({
  deps: [Messenger.Bot, Telegram.Bot, LineAssetsManager],
})(async (messengerBot, telegramBot, lineAssetManager) => {
  // clear page profile in Messenger
  await messengerBot.makeApiCall('DELETE', 'me/messenger_profile', {
    fields: [
      'get_started',
      'greeting',
      'persistent_menu',
      'whitelisted_domains',
    ],
  });

  // delete app subscriptions
  await messengerBot.makeApiCall(
    'DELETE',
    `${MESSENGER_PAGE_ID}/subscribed_apps`,
    { access_token: `${MESSENGER_APP_ID}|${MESSENGER_APP_SECRET}` }
  );

  // remove page from webhook subscription
  await messengerBot.makeApiCall(
    'DELETE',
    `${MESSENGER_APP_ID}/subscriptions`,
    {
      access_token: `${MESSENGER_APP_ID}|${MESSENGER_APP_SECRET}`,
      object: 'page',
    }
  );

  // delete webhook of the Telegram bot
  await telegramBot.makeApiCall('deleteWebhook');
  // clear commands of the Telegram bot
  await telegramBot.makeApiCall('setMyCommands', { commands: [] });

  // delete line rich menu
  await lineAssetManager.deleteRichMenu('default_menu.en');
});
