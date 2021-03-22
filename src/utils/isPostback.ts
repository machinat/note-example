import type { AppEventContext } from '../types';

const isPostback = ({ platform, event }: AppEventContext): boolean =>
  event.type === 'postback' ||
  (platform === 'telegram' && event.type === 'callback_query');

export default isPostback;
