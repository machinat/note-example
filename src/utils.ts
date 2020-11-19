import { container } from '@machinat/core/service';
import { BaseStateControllerI } from '@machinat/core/base';
import { GET_STARTED_POSTBACK_KEY, NOTE_SPACE_DATA_KEY } from './constant';

export const encodePostbackPayload = (payload) => {
  return Object.entries(payload)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export const decodePostbackPayload = (data) => {
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
      event.postback.payload === GET_STARTED_POSTBACK_KEY
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
