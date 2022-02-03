import Machinat from '@machinat/core';
import decodePostbackData from '../utils/decodePostbackData';
import OpenSpacePanel from '../components/OpenSpacePanel';
import SharePanel from '../components/SharePanel';
import Introduction from '../scenes/Introduction';
import type { AppEventContext } from '../types';

const handlePostback = async ({
  platform,
  reply,
  event,
}: AppEventContext & {
  event: { type: 'postback' | 'callback_query' | 'quick_reply' };
}) => {
  if (!event.channel) {
    return;
  }

  const { action } = decodePostbackData(event.data!);
  const isGroupChat =
    (event.platform === 'line' && event.channel.type !== 'user') ||
    (event.platform === 'telegram' && event.channel.type !== 'private');

  if (action === 'introduce') {
    return reply(<Introduction.Start channel={event.channel} />);
  }

  await reply(
    action === 'open' ? (
      <OpenSpacePanel>
        Open {isGroupChat ? 'group' : 'private'} notes:
      </OpenSpacePanel>
    ) : action === 'share' ? (
      <SharePanel />
    ) : null
  );
};

export default handlePostback;
