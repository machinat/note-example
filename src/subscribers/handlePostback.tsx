import Machinat from '@machinat/core';
import { MachinatNode } from '@machinat/core/types';
import { container } from '@machinat/core/service';
import { ScriptProcessor } from '@machinat/script';
import { AnswerCallbackQuery } from '@machinat/telegram/components';
import { TelegramServerAuthorizer } from '@machinat/telegram/auth';
import { ENTRY_URL_I } from '../interface';
import { decodePostbackPayload } from '../utils';
import OwnSpaceCard from '../components/OwnSpaceCard';
import ShareToFriend from '../components/ShareToFriend';
import Introduction from '../scenes/Introduction';

const handlePostback = (
  scriptProcessor: ScriptProcessor<any, any>,
  tgAuthorizer: TelegramServerAuthorizer,
  serverEntry: string
) => async ({ platform, bot, event }) => {
  console.log(JSON.stringify(event, null, 2));
  const { channel } = event;
  const { action } = decodePostbackPayload(event.data);

  let reply: null | MachinatNode = null;

  if (action === 'open') {
    if (platform === 'telegram') {
      const { user, queryId, chatInstanceChannel } = event;
      const code = await tgAuthorizer.signAuthCode(user, chatInstanceChannel);
      const authURL = `${serverEntry}/auth/telegram?code=${code}`;
      console.log(authURL);

      await bot.renderInstance(
        <AnswerCallbackQuery queryId={queryId} url={authURL} />
      );
      return;
    }

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

export default container({
  deps: [ScriptProcessor, TelegramServerAuthorizer, ENTRY_URL_I],
})(handlePostback);
