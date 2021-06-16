import { makeFactoryProvider } from '@machinat/core/service';
import BaseProfiler, { MachinatProfile } from '@machinat/core/base/Profiler';
import StateController from '@machinat/core/base/StateController';
import { MessengerUser, MessengerChat } from '@machinat/messenger';
import Telegram, { TelegramUser, TelegramChat } from '@machinat/telegram';
import Line, { LineUser, LineChat } from '@machinat/line';
import getStream from 'get-stream';
import { PROFILE_CACHE_KEY } from '../constant';

const useUserProfile = makeFactoryProvider({
  lifetime: 'singleton',
  deps: [
    StateController,
    BaseProfiler,
    Telegram.Profiler,
    Line.Profiler,
  ] as const,
})(
  (stateController, baseProfiler, telegramProfiler, lineProfiler) =>
    async (
      user: MessengerUser | TelegramUser | LineUser,
      chat: MessengerChat | TelegramChat | LineChat
    ): Promise<{ isNewUser: boolean; profile: MachinatProfile }> => {
      const cachedProfile = await stateController
        .userState(user)
        .get<MachinatProfile>(PROFILE_CACHE_KEY);

      let profile = cachedProfile;

      if (!profile) {
        if (user.platform === 'telegram') {
          const photo = await telegramProfiler.fetchUserPhoto(user);
          let avatarUrl;

          if (photo) {
            const photoData = await getStream(photo.content, {
              encoding: 'base64',
            });
            avatarUrl = `data:${photo.contentType};base64,${photoData}`;
          }

          profile = await telegramProfiler.getUserProfile(user, {
            inChat: chat as TelegramChat,
            avatarUrl,
          });
        } else if (user.platform === 'line') {
          profile = await lineProfiler.getUserProfile(user, {
            inChat: chat as LineChat,
          });
        } else {
          profile = await baseProfiler.getUserProfile(user);
        }

        await stateController
          .userState(user)
          .set<MachinatProfile>(PROFILE_CACHE_KEY, profile);
      }

      return { isNewUser: !cachedProfile, profile };
    }
);

export default useUserProfile;
