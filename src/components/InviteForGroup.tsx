import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { TelegramBotName } from '../interface';

const InviteForGroup = (botName: string) => (_, { platform }) => {
  const invitationWords = (
    <>
      You can also take notes with friends, add me to a group to open a shared
      space!
    </>
  );

  if (platform === 'telegram') {
    return (
      <Telegram.Expression
        replyMarkup={
          <Telegram.InlineKeyboard>
            <Telegram.UrlButton
              text="Share to a Group"
              url={`https://t.me/${botName}?startgroup=📝`}
            />
          </Telegram.InlineKeyboard>
        }
      >
        {invitationWords}
      </Telegram.Expression>
    );
  }

  if (platform === 'line') {
    return (
      <Line.Expression
        quickReplies={
          <Line.QuickReply>
            <Line.MessageAction label="Got it" />
          </Line.QuickReply>
        }
      >
        {invitationWords}
      </Line.Expression>
    );
  }

  return null;
};

export default makeContainer({
  deps: [TelegramBotName],
})(InviteForGroup);
