import Machinat from '@machinat/core';
import { StartRuntime } from '@machinat/script';
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
  const { channel } = event;
  if (!channel) {
    return;
  }

  const { action } = decodePostbackData(event.data!);
  const isGroupChat =
    (channel.platform === 'line' && channel.type !== 'user') ||
    (channel.platform === 'telegram' && channel.type !== 'private');

  await reply(
    action === 'open' ? (
      <OpenSpacePanel>
        Open {isGroupChat ? 'Group' : 'Private'} Notes Space
      </OpenSpacePanel>
    ) : action === 'share' ? (
      <SharePanel />
    ) : action === 'introduce' ? (
      <StartRuntime script={Introduction} channel={channel} />
    ) : null
  );
};

export default handlePostback;
