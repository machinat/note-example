import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import type { ConnectEventValue } from '@machinat/websocket/types';
import isUserToBot from '../utils/isUserToBot';
import userStateFactory from '../utils/useUserState';
import chatStateFactory from '../utils/useChatState';
import { USER_INFO_KEY, NOTE_DATA_KEY } from '../constant';
import {
  UserInfoState,
  AppDataNotif,
  WebviewActionContext,
  NoteDataState,
} from '../types';

const handleSocketConnect = makeContainer({
  deps: [StateController, userStateFactory, chatStateFactory] as const,
})(
  (stateController, useUserState, useChatState) => async ({
    bot,
    metadata: {
      connection,
      auth: { user, platform, channel: chat },
    },
  }: WebviewActionContext<ConnectEventValue>) => {
    const [
      { name, avatar, memberUids },
      { profile },
      noteState,
    ] = await Promise.all([
      useChatState(user, chat),
      useUserState(user, chat),
      stateController.channelState(chat).get<NoteDataState>(NOTE_DATA_KEY),
    ]);

    let members;
    if (memberUids) {
      const memberStates = await Promise.all(
        memberUids.map((uid) =>
          stateController.userState(uid).get<UserInfoState>(USER_INFO_KEY)
        )
      );

      members = memberStates
        .filter((state): state is UserInfoState => !!state)
        .map((state) => state.profile);
    }

    const appData: AppDataNotif = {
      kind: 'notif',
      type: 'app_data',
      payload: {
        platform,
        user: profile,
        chat: {
          isUserToBot: isUserToBot(chat),
          name,
          avatar,
          members,
        },
        notes: noteState?.notes || [],
      },
    };

    bot.subscribeTopic(connection, chat.uid);
    bot.send(connection, appData);
  }
);

export default handleSocketConnect;
