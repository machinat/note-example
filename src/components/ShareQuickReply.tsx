import Machinat from '@machinat/core';
import { QuickReply as MsgrQuickReply } from '@machinat/messenger/components';
import { SwitchInlineQueryButton } from '@machinat/telegram/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { encodePostbackData } from '../utils';

const ShareQuickReply = (_, { platform }) => {
  const title = 'Share to friend.';
  const payload = encodePostbackData({ action: 'share' });

  return platform === 'messenger' ? (
    <MsgrQuickReply title={title} payload={payload} />
  ) : platform === 'line' ? (
    <LineQuickReply
      action={<LinePostbackAction label={title} data={payload} />}
    />
  ) : platform === 'telegram' ? (
    <SwitchInlineQueryButton text={title} />
  ) : null;
};

export default ShareQuickReply;
