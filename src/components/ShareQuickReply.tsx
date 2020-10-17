import Machinat from '@machinat/core';
import { QuickReply as MsgrQuickReply } from '@machinat/messenger/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { encodePostbackPayload } from '../utils';

const ShareQuickReply = (_, { platform }) => {
  const title = 'Share to friend.';
  const payload = encodePostbackPayload({
    action: 'share',
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

export default ShareQuickReply;
