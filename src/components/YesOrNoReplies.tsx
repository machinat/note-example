import Machinat from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import encodePostbackData from '../utils/encodePostbackData';

const DEFAULT_YES_TEXT = 'OK.';
const DEFAULT_NO_TEXT = 'Nope!';

const DEFUALT_YES_PAYLOAD = encodePostbackData({ action: 'yes' });
const DEFAULT_NO_PAYLOAD = encodePostbackData({ action: 'no' });

const YesOrNoReplies = (
  {
    yesText,
    yesPayload,
    noText,
    noPayload,
  }: {
    yesText?: string;
    yesPayload?: string;
    noText?: string;
    noPayload?: string;
  },
  { platform }
) => {
  switch (platform) {
    case 'messenger':
      return (
        <>
          <Messenger.TextReply
            title={yesText || DEFAULT_YES_TEXT}
            payload={yesPayload || DEFUALT_YES_PAYLOAD}
          />
          <Messenger.TextReply
            title={noText || DEFAULT_NO_TEXT}
            payload={noPayload || DEFAULT_NO_PAYLOAD}
          />
        </>
      );

    case 'telegram':
      return (
        <>
          <Telegram.CallbackButton
            text={yesText || DEFAULT_YES_TEXT}
            data={yesPayload || DEFUALT_YES_PAYLOAD}
          />
          <Telegram.CallbackButton
            text={noText || DEFAULT_NO_TEXT}
            data={noPayload || DEFAULT_NO_PAYLOAD}
          />
        </>
      );

    case 'line':
      return (
        <>
          <Line.QuickReply>
            <Line.PostbackAction
              label={yesText || DEFAULT_YES_TEXT}
              displayText={yesText || DEFAULT_YES_TEXT}
              data={yesPayload || DEFUALT_YES_PAYLOAD}
            />
          </Line.QuickReply>
          <Line.QuickReply>
            <Line.PostbackAction
              label={noText || DEFAULT_NO_TEXT}
              displayText={noText || DEFAULT_NO_TEXT}
              data={noPayload || DEFAULT_NO_PAYLOAD}
            />
          </Line.QuickReply>
        </>
      );

    default:
      return null;
  }
};

export default YesOrNoReplies;
