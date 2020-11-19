import Machinat from '@machinat/core';
import { QuickReply as MsgrQuickReply } from '@machinat/messenger/components';
import { CallbackButton } from '@machinat/telegram/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { encodePostbackPayload } from '../utils';

const OpenSpaceQuickReply = (_, { platform }) => {
  const title = 'Open notes space.';
  const payload = encodePostbackPayload({ action: 'open' });

  return platform === 'messenger' ? (
    <MsgrQuickReply title={title} payload={payload} />
  ) : platform === 'line' ? (
    <LineQuickReply
      action={<LinePostbackAction label={title} data={payload} />}
    />
  ) : platform === 'telegram' ? (
    <CallbackButton text={title} data={payload} />
  ) : null;
};

export default OpenSpaceQuickReply;
