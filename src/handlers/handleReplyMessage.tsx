import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import AnswerSharing from '../components/AnswerSharing';
import NoteSpaceCard from '../components/NoteSpaceCard';
import WhatToDoExpression from '../components/WhatToDoExpression';
import useIntent from '../utils/useIntent';
import {
  INTENT_OK,
  INTENT_NO,
  INTENT_GREETING,
  INTENT_OPEN,
  INTENT_SHARE,
  INTENT_UNKNOWN,
} from '../constant';
import { ChatEventContext } from '../types';

const random = (arr) => arr[Math.floor(arr.length * Math.random())];

const POSITIVE_REPLIES = ['♥', '👍', '💪', '😊', '😎', '😘', '😍', '😇'];
const NEGATIVE_REPLIES = ['😭', '😣', '😖', '🤯', '🤐', '😢', '😳'];
const GREETING_REPLIES = ['Hi!', 'Hello!', '😁', '✋', '🖖', '🤗'];
const UNKNOWN_REPLIES = ['🧐', '🤔', '😻', '😼', '🙈', '🙉', '🙊'];

const handleReplyMessage = makeContainer({ deps: [useIntent] })(
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
        <AnswerSharing />
      ) : intent.type === INTENT_OPEN ? (
        <NoteSpaceCard>Open Notes Space 📝</NoteSpaceCard>
      ) : (
        <WhatToDoExpression>Hi! What can I help?</WhatToDoExpression>
      )
    );
  }
);

export default handleReplyMessage;
