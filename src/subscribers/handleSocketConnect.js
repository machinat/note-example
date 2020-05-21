import { container } from '@machinat/core/service';
import Base from '@machinat/core/base';
import StateController from '@machinat/state';
import { WALL_DATA_KEY } from '../constant';

const handleSocketConnect = container({
  deps: [StateController, Base.ProfileFetcherI],
})(
  (stateController, profileFetcher) => async ({
    bot,
    channel,
    connection,
    user,
  }) => {
    const channelData = await stateController
      .channelState(channel)
      .get(WALL_DATA_KEY);

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

    bot.attachTopic(connection, channel.uid);
    bot.send(connection, {
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
