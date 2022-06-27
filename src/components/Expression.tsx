import Sociably, { SociablyNode } from '@sociably/core';

import { Expression as MessengerExpression } from '@sociably/messenger/components';
import {
  Expression as TelegramExpression,
  ReplyKeyboard,
} from '@sociably/telegram/components';
import { Expression as LineExpression } from '@sociably/line/components';

const Expression = (
  {
    children,
    quickReplies,
  }: {
    children?: SociablyNode;
    quickReplies?: SociablyNode;
  },
  { platform }
) => {
  switch (platform) {
    case 'messenger':
      return (
        <MessengerExpression quickReplies={quickReplies}>
          {children}
        </MessengerExpression>
      );

    case 'telegram':
      return (
        <TelegramExpression
          replyMarkup={
            <ReplyKeyboard resizeKeyboard>{quickReplies}</ReplyKeyboard>
          }
        >
          {children}
        </TelegramExpression>
      );

    case 'line':
      return (
        <LineExpression quickReplies={quickReplies}>{children}</LineExpression>
      );

    default:
      return <>children</>;
  }
};

export default Expression;
