import { MESSENGER_START_ACTION } from './constant';

export const encodePostbackData = (payload) => {
  return Object.entries(payload)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export const decodePostbackData = (data) => {
  return data
    .split(/\s*&\s*/)
    .map((pair) => pair.split(/\s*=\s*/))
    .reduce((obj, [key, value]) => {
      if (key && value) {
        obj[key] = value; // eslint-disable-line  no-param-reassign
      }
      return obj;
    }, {});
};

export const isStarting = ({ platform, event }) => {
  if (platform === 'messenger') {
    return (
      event.type === 'postback' &&
      decodePostbackData(event.data).action === MESSENGER_START_ACTION
    );
  }

  if (platform === 'telegram') {
    return event.type === 'text' && event.text.slice(0, 6) === '/start';
  }

  if (platform === 'line') {
    return event.type === 'follow';
  }

  return false;
};

export const isPostback = ({ platform, event }) =>
  event.type === 'postback' ||
  (platform === 'telegram' && event.type === 'callback_query');
