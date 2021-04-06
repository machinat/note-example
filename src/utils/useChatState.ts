import { makeFactoryProvider } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';

import { MessengerUser, MessengerChat } from '@machinat/messenger';
import Telegram, { TelegramUser, TelegramChat } from '@machinat/telegram';
import Line, { LineUser, LineChat } from '@machinat/line';

import { CHAT_INFO_KEY } from '../constant';
import { ChatInfoState } from '../types';
import isGroupChat from './isGroupChat';

const PROFILE_CACHE_TIME = 864000000; // 10 day

const useChatStateFactory = (
  stateController: StateController,
  telegramProfiler: Telegram.Profiler,
  lineProfiler: Line.Profiler
) => async (
  user: MessengerUser | TelegramUser | LineUser,
  chat: MessengerChat | TelegramChat | LineChat
): Promise<ChatInfoState> => {
  let chatState = await stateController
    .channelState(chat)
    .get<ChatInfoState>(CHAT_INFO_KEY);

  if (!chatState) {
    chatState = {
      beginAt: undefined,
      updateAt: 0,
      name: undefined,
      avatar: undefined,
      memberUids: undefined,
    };
  }

  const now = Date.now();

  if (now - chatState.updateAt > PROFILE_CACHE_TIME) {
    let name;
    let avatar;

    if (chat.platform === 'telegram' && chat.type !== 'private') {
      ({ name, avatar } = await telegramProfiler.getChatProfile(chat));
    } else if (chat.platform === 'line' && chat.type === 'group') {
      ({ name, avatar } = await lineProfiler.getGroupProfile(chat));
    }

    chatState.name = name;
    chatState.avatar = avatar;
    chatState.updateAt = now;
  }

  if (
    isGroupChat(chat) &&
    !chatState.memberUids?.find((id) => id === user.uid)
  ) {
    chatState.memberUids = [...(chatState.memberUids || []), user.uid];
    chatState.updateAt = now;
  }

  if (chatState.updateAt === now) {
    await stateController
      .userState(user)
      .set<ChatInfoState>(CHAT_INFO_KEY, chatState);
  }

  return chatState;
};

export default makeFactoryProvider({
  lifetime: 'singleton',
  deps: [StateController, Telegram.Profiler, Line.Profiler] as const,
})(useChatStateFactory);
