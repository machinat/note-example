import Machinat from '@machinat/core';
import { QuickReply as MsgrQuickReply } from '@machinat/messenger/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { encodePostbackPayload } from '../utils';

const OpenSpaceQuickReply = (_, { platform }) => {
  const title = 'Open notes space.';
  const payload = encodePostbackPayload({
    action: 'open',
    from: 'quick_reply',
  });

  if (platform === 'messenger') {
    return <MsgrQuickReply title={title} payload={payload} />;
  }

  if (platform === 'line') {
    return (
      <LineQuickReply
        action={<LinePostbackAction label={title} data={payload} />}
      />
    );
  }

  return null;
};

export default OpenSpaceQuickReply;
