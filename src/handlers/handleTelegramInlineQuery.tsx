import Machinat from '@machinat/core';
import {
  AnswerInlineQuery,
  InlineQueryResultArticle,
  Text,
  InlineKeyboard,
  CallbackButton,
} from '@machinat/telegram/components';
import { makeContainer } from '@machinat/core/service';
import { TELEGRAM_REGISTER_CHAT_ACTION } from '../constant';
import { encodePostbackData } from '../utils';

const handleTelegramInlineQuery = makeContainer({})(
  () => async ({ bot, event }) => {
    const { queryId } = event;

    await bot.renderInstance(
      <AnswerInlineQuery queryId={queryId}>
        <InlineQueryResultArticle
          id="*"
          title="Take Secret Note in the Chat"
          inputMessageContent={<Text>aa</Text>}
          replyMarkup={
            <InlineKeyboard>
              <CallbackButton
                text="Open"
                data={encodePostbackData({
                  action: TELEGRAM_REGISTER_CHAT_ACTION,
                })}
              />
            </InlineKeyboard>
          }
        />
      </AnswerInlineQuery>
    );
  }
);

export default handleTelegramInlineQuery;
