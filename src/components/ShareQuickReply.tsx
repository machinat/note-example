import Machinat from '@machinat/core';
import { TextReply as MessengerTextReply } from '@machinat/messenger/components';
import { SwitchQueryButton } from '@machinat/telegram/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import encodePostbackData from '../utils/encodePostbackData';

const ShareQuickReply = (_, { platform }) => {
  const title = 'Share to friend.';
  const payload = encodePostbackData({ action: 'share' });

  switch (platform) {
    case 'messenger':
      return <MessengerTextReply title={title} payload={payload} />;

    case 'telegram':
      return <SwitchQueryButton text={title} />;

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

export default ShareQuickReply;
