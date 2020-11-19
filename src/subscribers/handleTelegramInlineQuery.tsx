import Machinat from '@machinat/core';
import { TelegramServerAuthorizer } from '@machinat/telegram/auth';
import {
  AnswerInlineQuery,
  InlineQueryResultArticle,
  Text,
  InlineKeyboard,
  CallbackButton,
} from '@machinat/telegram/components';
import { container } from '@machinat/core/service';
import { ENTRY_URL_I } from '../interface';
import { encodePostbackPayload } from '../utils';

const handleTelegramInlineQuery = container({
  deps: [TelegramServerAuthorizer, ENTRY_URL_I],
})(
  (authorizer: TelegramServerAuthorizer, serverEntry: string) => async ({
    bot,
    event,
  }) => {
    const { user, queryId } = event;

    await bot.renderInstance(
      <AnswerInlineQuery queryId={queryId}>
        <InlineQueryResultArticle
          id="*"
          title="A"
          inputMessageContent={<Text>aa</Text>}
          replyMarkup={
            <InlineKeyboard>
              <CallbackButton
                text="Open"
                data={encodePostbackPayload({ action: 'open' })}
              />
            </InlineKeyboard>
          }
        />
      </AnswerInlineQuery>
    );
  }
);

export default handleTelegramInlineQuery;
