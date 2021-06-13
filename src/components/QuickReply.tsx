import Machinat from '@machinat/core';
import { TextReply as MessengerTextReply } from '@machinat/messenger/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { TextReply } from '@machinat/telegram/components';
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
        <LineQuickReply
          action={
            <LinePostbackAction label={text} displayText={text} data={data} />
          }
        />
      );

    default:
      return null;
  }
};

export default QuickReply;
