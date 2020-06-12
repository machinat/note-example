import Machinat from '@machinat/core';
import { QuickReply as MsgrQuickReply } from '@machinat/messenger/components';
import {
  QuickReply as LineQuickReply,
  PostbackAction as LinePostbackAction,
} from '@machinat/line/components';
import { encodePostbackPayload } from '../utils';

const DEFAULT_YES_TEXT = 'OK.';
const DEFAULT_NO_TEXT = 'Nope!';

const DEFUALT_YES_PAYLOAD = encodePostbackPayload({
  action: 'yes',
  from: 'quick_reply',
});
const DEFAULT_NO_PAYLOAD = encodePostbackPayload({
  action: 'no',
  from: 'quick_reply',
});

const YesOrNoReplies = (
  { yesText, yesPayload, noText, noPayload },
  { platform }
) => {
  switch (platform) {
    case 'messenger':
      return [
        <MsgrQuickReply
          title={yesText || DEFAULT_YES_TEXT}
          payload={yesPayload || DEFUALT_YES_PAYLOAD}
        />,
        <MsgrQuickReply
          title={noText || DEFAULT_NO_TEXT}
          payload={noPayload || DEFAULT_NO_PAYLOAD}
        />,
      ];
    case 'line':
      return [
        <LineQuickReply
          action={
            <LinePostbackAction
              label={yesText || DEFAULT_YES_TEXT}
              text={yesText || DEFAULT_YES_TEXT}
              data={yesPayload || DEFUALT_YES_PAYLOAD}
            />
          }
        />,
        <LineQuickReply
          action={
            <LinePostbackAction
              label={noText || DEFAULT_NO_TEXT}
              text={noText || DEFAULT_NO_TEXT}
              data={noPayload || DEFAULT_NO_PAYLOAD}
            />
          }
        />,
      ];
    default:
      return null;
  }
};

export default YesOrNoReplies;
