import type { AppEventContext } from '../../types';

const isGroupChat = (channel: AppEventContext['event']['channel']) =>
  !!channel &&
  ((channel.platform === 'line' && channel.type !== 'user') ||
    (channel.platform === 'telegram' &&
      (channel.type === 'group' || channel.type === 'supergroup')));

export default isGroupChat;
