import Machinat from '@machinat/core';
import { QuickReply as MsgrQuickReply } from '@machinat/messenger/components';
import { CallbackButton } from '@machinat/telegram/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { encodePostbackData } from '../utils';

const OpenSpaceQuickReply = (_, { platform }) => {
  const title = 'Open notes space.';
  const payload = encodePostbackData({ action: 'open' });

  switch (platform) {
    case 'messenger':
      return <MsgrQuickReply title={title} payload={payload} />;

    case 'line':
      return (
        <LineQuickReply
          action={<LinePostbackAction label={title} data={payload} />}
        />
      );

    case 'telegram':
      return <CallbackButton text={title} data={payload} />;

    default:
      return null;
  }
};

export default OpenSpaceQuickReply;
