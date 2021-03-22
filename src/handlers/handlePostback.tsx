import Machinat from '@machinat/core';
import { StartRuntime } from '@machinat/script';
import decodePostbackData from '../utils/decodePostbackData';
import NoteSpaceCard from '../components/NoteSpaceCard';
import AnswerSharing from '../components/AnswerSharing';
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

  if (action === 'introduce') {
    await reply(<StartRuntime script={Introduction} channel={channel} />);
  }

  await reply(
    <>
      {action === 'open' ? (
        <NoteSpaceCard>
          Open {isGroupChat ? 'Group' : 'Private'} Notes Space
        </NoteSpaceCard>
      ) : action === 'share' ? (
        <AnswerSharing />
      ) : null}
    </>
  );
};

export default handlePostback;
