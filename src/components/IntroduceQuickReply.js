import Machinat from '@machinat/core';
import { QuickReply as MsgrQuickReply } from '@machinat/messenger/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { encodePostbackPayload } from '../utils';

const IntroduceQuickReply = (_, { platform }) => {
  const title = "What's this?";
  const payload = encodePostbackPayload({
    action: 'introduce',
    from: 'quick_reply',
  });

  if (platform === 'messenger') {
    return <MsgrQuickReply title={title} payload={payload} />;
  }

  if (platform === 'line') {
    return (
      <LineQuickReply
        action={<LinePostbackAction text={title} data={payload} />}
      />
    );
  }

  return null;
};

export default IntroduceQuickReply;
