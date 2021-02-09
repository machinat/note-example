import Machinat from '@machinat/core';
import { MachinatNode } from '@machinat/core/types';
import { makeContainer } from '@machinat/core/service';
import { ScriptProcessor } from '@machinat/script';
import { AnswerCallbackQuery } from '@machinat/telegram/components';
import { decodePostbackData } from '../utils';
import OwnSpaceCard from '../components/OwnSpaceCard';
import ShareToFriend from '../components/ShareToFriend';
import Introduction from '../scenes/Introduction';

const handlePostback = (
  scriptProcessor: ScriptProcessor<unknown, unknown>
) => async ({ platform, bot, event }) => {
  const { channel } = event;
  const { action } = decodePostbackData(event.data);

  if (action === 'tg_register_chat_instance') {
    const {
      // user,
      queryId,
      // chatInstanceChannel,
    } = event;

    await bot.renderInstance(
      <AnswerCallbackQuery
        queryId={queryId}
        url="http://t.me/your_bot?start=inline_chat"
      />
    );
    return;
  }

  let reply: null | MachinatNode = null;
  if (action === 'open') {
    reply = <OwnSpaceCard />;
  } else if (action === 'share') {
    reply = <ShareToFriend />;
  } else if (action === 'introduce') {
    const runtime = await scriptProcessor.start(channel, Introduction);
    reply = runtime.output();
  }

  await bot.render(
    channel,
    <>
      {reply}
      {platform === 'telegram' && event.type === 'callback_query' ? (
        <AnswerCallbackQuery queryId={event.queryId} />
      ) : null}
    </>
  );
};

export default makeContainer({
  deps: [ScriptProcessor],
})(handlePostback);
