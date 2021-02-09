import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import Profiler from '@machinat/core/base/Profiler';
// import { MessengerChat } from '@machinat/messenger';
import type { ConnectEventValue } from '@machinat/websocket/types';
// import { NOTE_SPACE_DATA_KEY } from '../constant';
import {
  // ChannelState,
  UserData,
  WebAppEventContext,
} from '../types';

const handleSocketConnect = makeContainer({
  deps: [StateController, Profiler] as const,
})(
  (stateController, profileFetcher) => async ({
    bot,
    event: { user },
    metadata: {
      connection,
      auth: { platform, channel: chatChannel },
    },
  }: WebAppEventContext<ConnectEventValue>) => {
    // const channelState = await stateController
    //   .channelState(chatChannel)
    //   .get<ChannelState>(NOTE_SPACE_DATA_KEY);
    //
    // const spaceType =
    //   chatChannel.platform === 'line'
    //     ? chatChannel.type === 'user'
    //       ? 'own'
    //       : 'group'
    //     : chatChannel.platform === 'messenger'
    //     ? chatChannel.type === MessengerChat.Type.UserToPage
    //       ? 'own'
    //       : chatChannel.type === MessengerChat.Type.UserToUser
    //       ? 'chat'
    //       : 'group'
    //     : 'own';

    const profile = await profileFetcher.getUserProfile(user);
    const { name, pictureUrl } = profile;

    const appData: UserData = {
      kind: 'app_data',
      type: 'user_data',
      payload: {
        platform,
        channels: [],
        profile: {
          uid: user.uid,
          avatar: pictureUrl,
          name,
        },
      },
    };

    bot.subscribeTopic(connection, chatChannel.uid);
    bot.send(connection, appData);
  }
);

export default handleSocketConnect;
