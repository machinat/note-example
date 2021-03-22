import { makeFactoryProvider } from '@machinat/core/service';
import BaseProfiler, { MachinatProfile } from '@machinat/core/base/Profiler';
import StateController from '@machinat/core/base/StateController';

import { MessengerUser, MessengerChat } from '@machinat/messenger';
import Telegram, { TelegramUser, TelegramChat } from '@machinat/telegram';
import Line, { LineUser, LineChat } from '@machinat/line';

import { USER_INFO_KEY } from '../constant';
import { UserInfoState } from '../types';

const PROFILE_CACHE_TIME = 864000000; // 10 day

const useUserStateFactory = (
  stateController: StateController,
  baseProfiler: BaseProfiler,
  telegramProfiler: Telegram.Profiler,
  lineProfiler: Line.Profiler
) => async (
  user: MessengerUser | TelegramUser | LineUser,
  chat: MessengerChat | TelegramChat | LineChat
): Promise<UserInfoState> => {
  let userState = await stateController
    .userState(user)
    .get<UserInfoState>(USER_INFO_KEY);

  if (!userState || Date.now() - userState.updateAt > PROFILE_CACHE_TIME) {
    let profile: MachinatProfile;

    if (user.platform === 'telegram') {
      profile = await telegramProfiler.getUserProfile(user, {
        inChat: chat as TelegramChat,
      });
    } else if (user.platform === 'line') {
      profile = await lineProfiler.getUserProfile(user, {
        inChat: chat as LineChat,
      });
    } else {
      profile = await baseProfiler.getUserProfile(user);
    }

    userState = {
      updateAt: Date.now(),
      profile,
    };

    await stateController
      .userState(user)
      .set<UserInfoState>(USER_INFO_KEY, userState);
  }

  return userState;
};

export default makeFactoryProvider({
  lifetime: 'singleton',
  deps: [
    StateController,
    BaseProfiler,
    Telegram.Profiler,
    Line.Profiler,
  ] as const,
})(useUserStateFactory);
