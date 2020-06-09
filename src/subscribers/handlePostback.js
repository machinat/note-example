import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import Script from '@machinat/script';
import { decodePostbackPayload } from '../utils';
import OwnSpaceCard from '../components/OwnSpaceCard';
import ShareToFriend from '../components/ShareToFriend';
import Introduction from '../scenes/Introduction';

const handlePostback = scriptProcessor => async ({
  platform,
  bot,
  channel,
  event,
}) => {
  const payload = decodePostbackPayload(
    platform === 'messenger'
      ? event.type === 'message'
        ? event.quickReply.payload
        : event.postback.payload
      : event.data
  );

  if (payload.action === 'open') {
    await bot.render(channel, <OwnSpaceCard />);
  } else if (payload.action === 'share') {
    await bot.render(channel, <ShareToFriend />);
  } else if (payload.action === 'introduce') {
    const existingRuntime = await scriptProcessor.continue(channel);
    if (!existingRuntime) {
      await bot.render(channel, <Introduction.Init channel={channel} />);
    }
  }
};

export default container({ deps: [Script.Processor] })(handlePostback);
