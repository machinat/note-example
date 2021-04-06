import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { StartRuntime } from '@machinat/script';
import SharePanel from '../components/SharePanel';
import OpenSpacePanel from '../components/OpenSpacePanel';
import WhatToDoExpression from '../components/WhatToDoExpression';
import Introduce from '../scenes/Introduction';
import useEventIntent from '../utils/useEventIntent';
import {
  INTENT_OK,
  INTENT_NO,
  INTENT_GREETING,
  INTENT_OPEN,
  INTENT_SHARE,
  INTENT_INTRODUCE,
  INTENT_UNKNOWN,
} from '../constant';
import { ChatEventContext } from '../types';

const random = (arr) => arr[Math.floor(arr.length * Math.random())];

const POSITIVE_REPLIES = ['♥', '👍', '💪', '😊', '😎', '😘', '😍', '😇'];
const NEGATIVE_REPLIES = ['😭', '😣', '😖', '🤯', '🤐', '😢', '😳'];
const GREETING_REPLIES = ['Hi!', 'Hello!', '😁', '✋', '🖖', '🤗'];
const UNKNOWN_REPLIES = ['🧐', '🤔', '😻', '😼', '🙈', '🙉', '🙊'];

const handleReplyMessage = makeContainer({ deps: [useEventIntent] })(
  (getIntent) => async ({ reply, event }: ChatEventContext) => {
    const intent = await getIntent(event);
    await reply(
      intent.type === INTENT_OK ? (
        random(POSITIVE_REPLIES)
      ) : intent.type === INTENT_NO ? (
        random(NEGATIVE_REPLIES)
      ) : intent.type === INTENT_GREETING ? (
        random(GREETING_REPLIES)
      ) : intent.type === INTENT_UNKNOWN ? (
        random(UNKNOWN_REPLIES)
      ) : intent.type === INTENT_SHARE ? (
        <SharePanel />
      ) : intent.type === INTENT_INTRODUCE ? (
        <StartRuntime script={Introduce} channel={event.channel!} />
      ) : intent.type === INTENT_OPEN ? (
        <OpenSpacePanel>Open Notes Space 📝</OpenSpacePanel>
      ) : (
        <WhatToDoExpression>Hi! What can I help?</WhatToDoExpression>
      )
    );
  }
);

export default handleReplyMessage;
