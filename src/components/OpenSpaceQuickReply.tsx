import Machinat from '@machinat/core';
import { TextReply as MessengerTextReply } from '@machinat/messenger/components';
import { CallbackButton } from '@machinat/telegram/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import encodePostbackData from '../utils/encodePostbackData';

const OpenSpaceQuickReply = (_, { platform }) => {
  const title = 'Open notes space.';
  const payload = encodePostbackData({ action: 'open' });

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

export default OpenSpaceQuickReply;
