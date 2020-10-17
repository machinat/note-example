import { container } from '@machinat/core/service';
import WebSocket from '@machinat/websocket';
import Base from '@machinat/core/base';
import { ConnectEvent } from '@machinat/websocket/types';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import {
  ConnectionConnect,
  WebViewEventContext,
  AppDataNotication,
} from '../types';

const handleSocketConnect = container({
  deps: [WebSocket.Bot, Base.StateControllerI, Base.Profiler],
})(
  (webSocketBot, stateController, profileFetcher) => async ({
    event: { user, channel },
    metadata: { connection },
  }: WebViewEventContext<ConnectionConnect>) => {
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
    const { platform, name, pictureURL } = profile;

    const appData: AppDataNotication = {
      kind: 'app',
      type: 'app_data',
      payload: {
        spaceType,
        profile: { platform, name, pictureURL },
        notes: channelData?.notes || [],
      },
    };

    webSocketBot.attachTopic(connection, channel.uid);
    webSocketBot.send(connection, appData);
  }
);

export default handleSocketConnect;
