import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import Script from '@machinat/script';
import decodePostbackData from '../utils/decodePostbackData';
import OpenSpacePanel from '../components/OpenSpacePanel';
import SharePanel from '../components/SharePanel';
import Introduction from '../scenes/Introduction';
import type { AppEventContext } from '../types';

const handlePostback = makeContainer({ deps: [Script.Processor] })(
  (processor) =>
    async ({
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
        const runtime = await processor.start(event.channel!, Introduction);
        return reply(runtime.output());
      }

      await reply(
        action === 'open' ? (
          <OpenSpacePanel>
            Open {isGroupChat ? 'Group' : 'Private'} Notes Space
          </OpenSpacePanel>
        ) : action === 'share' ? (
          <SharePanel />
        ) : null
      );
    }
);

export default handlePostback;
