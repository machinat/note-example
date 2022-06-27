import Sociably, { SociablyNode } from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import { WebviewButton as MessengerWebviewButton } from '@sociably/messenger/webview';
import * as Telegram from '@sociably/telegram/components';
import { WebviewButton as TelegramWebviewButton } from '@sociably/telegram/webview';
import * as Line from '@sociably/line/components';
import { WebviewAction as LineWebviewAction } from '@sociably/line/webview';

type OpenSpacePanelProps = {
  children: SociablyNode;
  additionalButton?: SociablyNode;
};

const OpenSpacePanel = (
  { children, additionalButton }: OpenSpacePanelProps,
  { platform }
) => {
  if (platform === 'messenger') {
    return (
      <Messenger.ButtonTemplate
        buttons={
          <>
            <MessengerWebviewButton title="Open 📝" />
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
            <TelegramWebviewButton text="Open 📝" />
            {additionalButton}
          </Telegram.InlineKeyboard>
        }
      >
        {children}
      </Telegram.Text>
    );
  }

  if (platform === 'line') {
    return (
      <Line.ButtonTemplate
        defaultAction={<LineWebviewAction />}
        altText={(template) => template.text}
        actions={
          <>
            <LineWebviewAction label="Open 📝" />
            {additionalButton}
          </>
        }
      >
        {children}
      </Line.ButtonTemplate>
    );
  }

  return <p>{children} </p>;
};

export default OpenSpacePanel;
