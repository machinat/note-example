import Machinat, { MachinatNode, makeContainer } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { EntryUrl, LineLiffId } from '../interface';

type OpenSpacePanelProps = {
  children: MachinatNode;
  additionalButton?: MachinatNode;
};

const OpenSpacePanel =
  (entry: string, lineLiffId: string) =>
  ({ children, additionalButton }: OpenSpacePanelProps, { platform }) => {
    const webviewUrl = new URL(`/webview?platform=${platform}`, entry);

    if (platform === 'messenger') {
      return (
        <Messenger.ButtonTemplate
          buttons={
            <>
              <Messenger.UrlButton
                title="Open 📝"
                url={webviewUrl.href}
                messengerExtensions
              />
              {additionalButton}
            </>
          }
          sharable={false}
        >
          {children}
        </Messenger.ButtonTemplate>
      );
    }

    if (platform === 'telegram') {
      return (
        <Telegram.Text
          replyMarkup={
            <Telegram.InlineKeyboard>
              <Telegram.UrlButton
                login
                text="Open 📝"
                url={`${entry}/auth/telegram`}
              />
              {additionalButton}
            </Telegram.InlineKeyboard>
          }
        >
          {children}
        </Telegram.Text>
      );
    }

    if (platform === 'line') {
      const liffUrl = `https://liff.line.me/${lineLiffId}`;
      return (
        <Line.ButtonTemplate
          defaultAction={<Line.UriAction uri={liffUrl} />}
          altText={liffUrl}
          actions={
            <>
              <Line.UriAction label="Open 📝" uri={liffUrl} />
              {additionalButton}
            </>
          }
        >
          {children}
        </Line.ButtonTemplate>
      );
    }

    return (
      <p>
        {children}
        {'\n\n'}
        {webviewUrl.href}
      </p>
    );
  };

export default makeContainer({
  deps: [EntryUrl, LineLiffId],
})(OpenSpacePanel);
