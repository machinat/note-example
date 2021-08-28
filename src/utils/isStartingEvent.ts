import type { AppEventContext } from '../../types';
import { MESSENGER_START_ACTION } from '../constant';
import decodePostbackData from './decodePostbackData';

const isStarting = ({ platform, event }: AppEventContext): boolean => {
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

export default isStarting;
