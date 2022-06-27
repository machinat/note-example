import Sociably, { SociablyNode, makeContainer } from '@sociably/core';
import * as Telegram from '@sociably/telegram/components';
import * as Line from '@sociably/line/components';
import {
  TelegramBotName,
  LineOfficialAccountId,
  FbPageName,
} from '../interface';

type SharePanelProps = {
  children?: SociablyNode;
  additionalButton?: SociablyNode;
};

const defaultWords = (
  <>
    Thank you! 🤗
    <br />
    You can invite me in a group to share notes with friends!
    <br />
    Or simply share me.
  </>
);

const SharePanel =
  (fbPageName: string, tgBotName: string, lineAccountId: string) =>
  ({ children, additionalButton }: SharePanelProps, { platform }) => {
    if (platform === 'telegram') {
      return (
        <Telegram.Expression
          replyMarkup={
            <Telegram.InlineKeyboard>
              <Telegram.UrlButton
                text="Add to group 👥"
                url={`https://t.me/${tgBotName}?startgroup=📝`}
              />
              <Telegram.UrlButton
                text="Share me 🤖"
                url={`https://t.me/share/url?url=${encodeURIComponent(
                  `https://t.me/${tgBotName}`
                )}&text=${encodeURIComponent('Sociably Note')}`}
              />
              {additionalButton}
            </Telegram.InlineKeyboard>
          }
        >
          {children || defaultWords}
        </Telegram.Expression>
      );
    }

    if (platform === 'line') {
      return (
        <Line.ButtonTemplate
          altText={(template) => `${template.text}\n
To share this app, send this link to friends:
https://line.me/R/ti/p/${lineAccountId}`}
          actions={
            <>
              <Line.UriAction
                label="Share me 🤖"
                uri={`https://line.me/R/nv/recommendOA/${lineAccountId}`}
              />
              {additionalButton}
            </>
          }
        >
          {children || defaultWords}
        </Line.ButtonTemplate>
      );
    }

    if (platform === 'messenger') {
      return (
        <>
          <p>
            Thank you! 🤗
            <br />
            You can share this link to friends:
          </p>
          <p>https://m.me/{fbPageName}</p>
        </>
      );
    }

    return null;
  };

export default makeContainer({
  deps: [FbPageName, TelegramBotName, LineOfficialAccountId],
})(SharePanel);
