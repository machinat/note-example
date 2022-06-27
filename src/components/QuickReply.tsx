import Sociably from '@sociably/core';
import { TextReply as MessengerTextReply } from '@sociably/messenger/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@sociably/line/components';
import { TextReply } from '@sociably/telegram/components';
import encodePostbackData from '../utils/encodePostbackData';
import type { AppIntentType } from '../types';

type QuickReplyProps = {
  text: string;
  action: AppIntentType;
};

const QuickReply = ({ text, action }: QuickReplyProps, { platform }) => {
  const data = encodePostbackData({ action });

  switch (platform) {
    case 'messenger':
      return <MessengerTextReply title={text} payload={data} />;

    case 'telegram':
      return <TextReply text={text} />;

    case 'line':
      return (
        <LineQuickReply>
          <LinePostbackAction label={text} displayText={text} data={data} />
        </LineQuickReply>
      );

    default:
      return null;
  }
};

export default QuickReply;
