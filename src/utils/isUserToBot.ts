import { MessengerChat } from '@machinat/messenger';
import { TelegramChat } from '@machinat/telegram';
import type { LineChat } from '@machinat/line';

const isUserToBotChat = (
  chat: MessengerChat | TelegramChat | LineChat
): boolean =>
  (chat.platform === 'messenger' &&
    chat.type === MessengerChat.Type.UserToPage) ||
  (chat.platform === 'telegram' && chat.type === 'private') ||
  (chat.platform === 'line' && chat.type === 'user');

export default isUserToBotChat;
