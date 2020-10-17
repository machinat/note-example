import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import Script from '@machinat/script';
import { decodePostbackPayload } from '../utils';
import OwnSpaceCard from '../components/OwnSpaceCard';
import ShareToFriend from '../components/ShareToFriend';
import Introduction from '../scenes/Introduction';

const handlePostback = (scriptProcessor) => async ({ bot, event }) => {
  const { channel } = event;
  const { action } = decodePostbackPayload(event.data);

  if (action === 'open') {
    await bot.render(channel, <OwnSpaceCard />);
  } else if (action === 'share') {
    await bot.render(channel, <ShareToFriend />);
  } else if (action === 'introduce') {
    const existingRuntime = await scriptProcessor.continue(channel);
    if (!existingRuntime) {
      await bot.render(channel, <Introduction.Start channel={channel} />);
    }
  }
};

export default container({ deps: [Script.Processor] })(handlePostback);
