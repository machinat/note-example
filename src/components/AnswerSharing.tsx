import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import {
  TelegramBotName,
  LineOfficialAccountId,
  FbPageName,
} from '../interface';

const ShareApp = (
  fbPageName: string,
  tgBotName: string,
  lineAccountId: string
) => (_, { platform }) => {
  const shareWords =
    'You can add me to a group to open a shared notes space, or simply share this App.';

  if (platform === 'telegram') {
    return (
      <Telegram.Expression
        replyMarkup={
          <Telegram.InlineKeyboard>
            <Telegram.UrlButton
              text="Add to Group"
              url={`https://t.me/${tgBotName}?startgroup=📝`}
            />
            <Telegram.UrlButton
              text="Share App"
              url={`https://t.me/share/url?url=${encodeURIComponent(
                `https://t.me/${tgBotName}`
              )}&text=${encodeURIComponent('Machinat Note Example')}`}
            />
          </Telegram.InlineKeyboard>
        }
      >
        {shareWords}
      </Telegram.Expression>
    );
  }

  if (platform === 'line') {
    return (
      <Line.ButtonTemplate
        altText={shareWords}
        actions={
          <Line.UriAction
            label="Share App"
            uri={`https://line.me/R/nv/recommendOA/${lineAccountId}`}
          />
        }
      >
        {shareWords}
      </Line.ButtonTemplate>
    );
  }

  if (platform === 'messenger') {
    return (
      <p>
        Share the App link to friends:
        <br />
        http://m.me/{fbPageName}
      </p>
    );
  }

  return null;
};

export default makeContainer({
  deps: [FbPageName, TelegramBotName, LineOfficialAccountId],
})(ShareApp);
