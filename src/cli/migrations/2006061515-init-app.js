import fs from 'fs';
import axios from 'axios';
import Messenger from '@machinat/messenger';
import Line from '@machinat/line';
import LineAssetRegistry from '@machinat/line/asset';

const { ENTRY_URL, LINE_LIFF_ID, LINE_ACCESS_TOKEN } = process.env;

export const up = async app => {
  const [messengerBot, lineBot, lineAssetRegistry] = app.useServices([
    Messenger.Bot,
    Line.Bot,
    LineAssetRegistry,
  ]);
  await messengerBot.dispatchAPICall('POST', 'me/messenger_profile', {
    whitelisted_domains: [ENTRY_URL],
    get_started: {
      payload: '__GET_STARTED__',
    },
  });
  await messengerBot.dispatchAPICall('POST', 'me/messenger_profile', {
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: 'web_url',
            title: '👤 My Space',
            url: 'https://proxy.machinat.com/webview/note?platform=messenger',
            webview_height_ratio: 'full',
            messenger_extensions: true,
          },
          {
            type: 'postback',
            title: '👥 Use w/ Friends',
            payload: 'action=share&from=menu',
          },
        ],
      },
    ],
  });
  const richMenuId = await lineAssetRegistry.createRichMenu('default_menu.en', {
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
          uri: `https://liff.line.me/${LINE_LIFF_ID}/webview/note?platform=line&fromBotChannel=true`,
        },
      },
      {
        bounds: { x: 367, y: 0, width: 433, height: 250 },
        action: {
          type: 'postback',
          data: 'action=share&from=menu',
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
  await lineBot.dispatchAPICall(
    'POST',
    `v2/bot/user/all/richmenu/${richMenuId}`
  );
};

export const down = async app => {
  const [messengerBot, lineAssetRegistry] = app.useServices([
    Messenger.Bot,
    LineAssetRegistry,
  ]);
  await messengerBot.dispatchAPICall('DELETE', 'me/messenger_profile', {
    fields: ['get_started', 'persistent_menu', 'whitelisted_domains'],
  });
  await lineAssetRegistry.deleteRichMenu('default_menu.en');
};
