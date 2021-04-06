import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import isJoiningGroupEvent from '../utils/isJoiningGroupEvent';
import OpenSpacePanel from '../components/OpenSpacePanel';
import { TelegramBotName, LineOfficialAccountId } from '../interface';
import { AppEventContext } from '../types';

const handleGroupEvent = (
  telegramBotName: string,
  lineAccountId: string
) => async (context: AppEventContext) => {
  const { platform, event, reply } = context;

  const linkToBotButton =
    platform === 'telegram' ? (
      <Telegram.UrlButton
        text="Learn More 🤖"
        url={`https://t.me/${telegramBotName}`}
      />
    ) : platform === 'line' ? (
      <Line.UriAction
        label="Learn More 🤖"
        uri={`https://line.me/R/ti/p/${lineAccountId}`}
      />
    ) : null;

  if (isJoiningGroupEvent(context)) {
    await reply(
      <OpenSpacePanel additionalButton={linkToBotButton}>
        Hi, I'm a bot for taking notes in chat.{'\n\n'}You can{' '}
        {platform === 'telegram' ? (
          <>
            use <b>/note</b> command
          </>
        ) : platform === 'line' ? (
          `tag me with ${lineAccountId}`
        ) : (
          'call me'
        )}{' '}
        to open notes space in the chat room.
      </OpenSpacePanel>
    );
  } else if (
    event.type === 'text' &&
    (platform === 'telegram' ||
      (platform === 'line' && event.text.indexOf(`${lineAccountId}`) !== -1))
  ) {
    await reply(
      <OpenSpacePanel additionalButton={linkToBotButton}>
        Open Notes Space of this Chatroom
      </OpenSpacePanel>
    );
  }
};

export default makeContainer({
  deps: [TelegramBotName, LineOfficialAccountId],
})(handleGroupEvent);
