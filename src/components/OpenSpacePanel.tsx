import Machinat, { MachinatNode } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import { WebviewButton as MessengerWebviewButton } from '@machinat/messenger/webview';
import * as Telegram from '@machinat/telegram/components';
import { WebviewButton as TelegramWebviewButton } from '@machinat/telegram/webview';
import * as Line from '@machinat/line/components';
import { WebviewAction as LineWebviewAction } from '@machinat/line/webview';

type OpenSpacePanelProps = {
  children: MachinatNode;
  additionalButton?: MachinatNode;
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
