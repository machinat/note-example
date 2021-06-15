import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import type { ConnectEventValue } from '@machinat/websocket';
import isGroupChat from '../utils/isGroupChat';
import useUserState from '../utils/useUserState';
import useChatState from '../utils/useChatState';
import { USER_INFO_KEY, NOTE_DATA_KEY } from '../constant';
import {
  UserInfoState,
  AppDataPush,
  WebviewActionContext,
  NoteDataState,
} from '../types';

const handleSocketConnect =
  (
    stateController: StateController,
    getUserState: ReturnType<typeof useUserState>,
    getChatState: ReturnType<typeof useChatState>
  ) =>
  async ({
    bot,
    metadata: {
      connection,
      auth: { user, platform, channel: chat },
    },
  }: WebviewActionContext<ConnectEventValue>) => {
    const [{ name, avatar, memberUids }, { profile }, noteState] =
      await Promise.all([
        getChatState(user, chat),
        getUserState(user, chat),
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

    const appData: AppDataPush = {
      category: 'webview_push',
      type: 'app_data',
      payload: {
        platform,
        user: profile,
        chat: {
          isGroupChat: isGroupChat(chat),
          name,
          avatar,
          members,
        },
        notes: noteState?.notes || [],
      },
    };

    await Promise.all([
      bot.subscribeTopic(connection, chat.uid),
      bot.send(connection, appData),
    ]);
  };

export default makeContainer({
  deps: [StateController, useUserState, useChatState] as const,
})(handleSocketConnect);
