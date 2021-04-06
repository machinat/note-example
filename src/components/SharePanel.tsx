import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { MachinatNode } from '@machinat/core/types';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import {
  TelegramBotName,
  LineOfficialAccountId,
  FbPageName,
} from '../interface';

type SharePanelProps = {
  children?: MachinatNode;
  additionalButton?: MachinatNode;
};

const defaultWords =
  'Add me to a group for sharing notes, or simply share this App:';

const SharePanel = (
  fbPageName: string,
  tgBotName: string,
  lineAccountId: string
) => ({ children, additionalButton }: SharePanelProps, { platform }) => {
  if (platform === 'telegram') {
    return (
      <Telegram.Expression
        replyMarkup={
          <Telegram.InlineKeyboard>
            <Telegram.UrlButton
              text="Add to Group 👥"
              url={`https://t.me/${tgBotName}?startgroup=📝`}
            />
            <Telegram.UrlButton
              text="Share App 🤖"
              url={`https://t.me/share/url?url=${encodeURIComponent(
                `https://t.me/${tgBotName}`
              )}&text=${encodeURIComponent('Machinat Note Example')}`}
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
              label="Share App 🤖"
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
        <p>Please share this link to friends:</p>
        <p>https://m.me/{fbPageName}</p>
      </>
    );
  }

  return null;
};

export default makeContainer({
  deps: [FbPageName, TelegramBotName, LineOfficialAccountId],
})(SharePanel);
