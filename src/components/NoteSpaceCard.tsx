import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { EntryUrl, LineLiffId } from '../interface';

const OwnSpaceCard = makeContainer({ deps: [EntryUrl, LineLiffId] })(
  (entry, liffId) => ({ children }, { platform }) => {
    const webviewURL = new URL(`/?platform=${platform}`, entry);

    if (platform === 'messenger') {
      return (
        <Messenger.ButtonTemplate
          buttons={
            <Messenger.UrlButton
              title="Go"
              url={webviewURL.href}
              messengerExtensions
            />
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
                text="Go"
                url={`${EntryUrl}/auth/telegram/login`}
              />
            </Telegram.InlineKeyboard>
          }
        >
          {children}
        </Telegram.Text>
      );
    }

    if (platform === 'line') {
      const liffLocation = `https://liff.line.me/${liffId}?userToBot=true`;
      return (
        <Line.ButtonTemplate
          defaultAction={<Line.UriAction uri={liffLocation} />}
          altText={liffLocation}
          actions={<Line.UriAction label="Go" uri={liffLocation} />}
        >
          {children}
        </Line.ButtonTemplate>
      );
    }

    return (
      <p>
        {children}
        {'\n\n'}
        {webviewURL.href}
      </p>
    );
  }
);

export default OwnSpaceCard;
