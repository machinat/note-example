import type { AppEventContext } from '../types';

const isPostback = ({ event }: AppEventContext): boolean =>
  (event.platform === 'messenger' &&
    (event.type === 'postback' || event.type === 'quick_reply')) ||
  (event.platform === 'telegram' && event.type === 'callback_query') ||
  (event.platform === 'line' && event.type === 'postback');

export default isPostback;
