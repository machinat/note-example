import type { AppEventContext } from '../../types';

const isJoiningGroupEvent = ({ event }: AppEventContext): boolean =>
  (event.platform === 'telegram' &&
    event.type === 'bot_member_updated' &&
    event.oldStatus === 'left' &&
    event.newStatus === 'member') ||
  (event.platform === 'line' && event.type === 'join');

export default isJoiningGroupEvent;
