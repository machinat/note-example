import { GET_STARTED_POSTBACK_KEY } from './constant';

export const encodePostbackPayload = payload => {
  return Object.entries(payload)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export const decodePostbackPayload = data => {
  return data
    .split(/\s*&\s*/)
    .map(pair => pair.split(/\s*=\s*/))
    .reduce((obj, [key, value]) => {
      if (key && value) {
        obj[key] = value; // eslint-disable-line  no-param-reassign
      }
      return obj;
    }, {});
};

export const isFirstMeet = ({ platform, event }) =>
  (platform === 'messenger' &&
    event.type === 'postback' &&
    event.postback.payload === GET_STARTED_POSTBACK_KEY) ||
  (platform === 'line' && event.type === 'follow');

export const isPostback = ({ platform, event }) =>
  event.type === 'postback' ||
  (platform === 'messenger' && event.type === 'message' && !!event.quickReply);
