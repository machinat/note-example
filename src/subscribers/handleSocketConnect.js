import { container } from '@machinat/core/service';
import WebSocket from '@machinat/websocket';
import Base from '@machinat/core/base';
import { NOTE_SPACE_DATA_KEY } from '../constant';

const handleSocketConnect = container({
  deps: [WebSocket.Bot, Base.StateControllerI, Base.ProfileFetcherI],
})(
  (webSocketBot, stateController, profileFetcher) => async ({
    channel,
    connection,
    user,
  }) => {
    const channelData = await stateController
      .channelState(channel)
      .get(NOTE_SPACE_DATA_KEY);

    const spaceType =
      channel.platform === 'line'
        ? channel.type === 'utob'
          ? 'own'
          : channel.type === 'utou'
          ? 'chat'
          : 'group'
        : channel.platform === 'messenger'
        ? channel.type === 'USER_TO_PAGE'
          ? 'own'
          : channel.type === 'USER_TO_USER'
          ? 'chat'
          : 'group'
        : 'own';

    const profile = await profileFetcher.fetchProfile(user);
    const { platform, id, name, pictureURL } = profile;

    webSocketBot.attachTopic(connection, channel.uid);
    webSocketBot.send(connection, {
      type: 'app_data',
      payload: {
        spaceType,
        profile: { platform, id, name, pictureURL },
        notes: channelData?.notes || [],
      },
    });
  }
);

export default handleSocketConnect;
