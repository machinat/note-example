import Machinat from '@machinat/core';
import { QuickReply as MessengerQuickReply } from '@machinat/messenger/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { CallbackButton } from '@machinat/telegram/components';
import { encodePostbackData } from '../utils';

const IntroduceQuickReply = (_, { platform }) => {
  const title = "What's this?";
  const payload = encodePostbackData({ action: 'introduce' });

  return platform === 'messenger' ? (
    <MessengerQuickReply title={title} payload={payload} />
  ) : platform === 'line' ? (
    <LineQuickReply
      action={<LinePostbackAction label={title} data={payload} />}
    />
  ) : platform === 'telegram' ? (
    <CallbackButton text={title} data={payload} />
  ) : null;
};

export default IntroduceQuickReply;
