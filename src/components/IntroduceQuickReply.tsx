import Machinat from '@machinat/core';
import { TextReply as MessengerTextReply } from '@machinat/messenger/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { CallbackButton } from '@machinat/telegram/components';
import encodePostbackData from '../utils/encodePostbackData';

const IntroduceQuickReply = (_, { platform }) => {
  const title = "What's this?";
  const payload = encodePostbackData({ action: 'introduce' });

  switch (platform) {
    case 'messenger':
      return <MessengerTextReply title={title} payload={payload} />;

    case 'telegram':
      return <CallbackButton text={title} data={payload} />;

    case 'line':
      return (
        <LineQuickReply>
          <LinePostbackAction label={title} data={payload} />
        </LineQuickReply>
      );

    default:
      return null;
  }
};

export default IntroduceQuickReply;
