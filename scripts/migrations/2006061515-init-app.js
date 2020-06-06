import Messenger from '@machinat/messenger';

const { ENTRY } = process.env;

export const up = async app => {
  const [messengerBot] = app.useServices([Messenger.Bot]);
  await messengerBot.dispatchAPICall('POST', 'me/messenger_profile', {
    whitelisted_domains: [ENTRY],
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
            title: 'My Space',
            url: 'https://proxy.machinat.com/webview/note?platform=messenger',
            webview_height_ratio: 'full',
            messenger_extensions: true,
          },
        ],
      },
    ],
  });
};

export const down = async app => {
  const [messengerBot] = app.useServices([Messenger.Bot]);
  await messengerBot.dispatchAPICall('DELETE', 'me/messenger_profile', {
    fields: ['whitelisted_domains', 'get_started', 'persistent_menu'],
  });
};
