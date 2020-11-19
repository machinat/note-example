import Machinat from '@machinat/core';
import * as Telegram from '@machinat/telegram/components';
import ShareSpaceCard from './ShareSpaceCard';
import Pause from './Pause';

const ShareToFriend = ({ noIndicator = false }, { platform }) => {
  if (platform === 'telegram') {
    <Telegram.Text
      replyMarkup={
        <Telegram.InlineKeyboard>
          <Telegram.SwitchInlineQueryButton text="Share" />;
        </Telegram.InlineKeyboard>
      }
    >
      Select a chat to share a note space with 👇
    </Telegram.Text>;
  }

  return (
    <>
      {noIndicator
        ? null
        : 'Please forward this card 👇 to your friend or group.'}
      <ShareSpaceCard />

      <Pause />

      {platform === 'messenger' ? (
        <p>
          If you're using facebook in browser, you might need to "Open in
          Messenger" to show the forward button.
        </p>
      ) : null}
    </>
  );
};

export default ShareToFriend;
