import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import DialogFlow from '@machinat/dialogflow';
import ShareToFriend from '../components/ShareToFriend';
import OwnSpaceCard from '../components/OwnSpaceCard';
import WhatToDoExpression from '../components/WhatToDoExpression';

const random = (arr) => arr[Math.floor(arr.length * Math.random())];

const POSITIVE_REPLIES = [
  'Thank U! ♥',
  "I'm glad you like it!",
  '♥',
  '👍',
  '💪',
  '😊',
  '😎',
  '😘',
  '😍',
  '😇',
];
const NEGATIVE_REPLIES = ['😭', '😣', '😖', '🤯', '🤐', '😢', '😳'];
const GREETING_REPLIES = ['Hi!', 'Hello!', 'Greeting!', '😁', '✋', '🖖', '🤗'];
const CURSE_REPLIES = ['😠', '😱', '😰', '😵', '😫', '🤕', '💩', '🙄'];
const UNKNOWN_REPLIES = ['🧐', '🤔', '😻', '😼', '🙈', '🙉', '🙊'];

const handleReplyMessage = (recognizer: DialogFlow.IntentRecognizer) => async ({
  bot,
  event,
}) => {
  const { channel } = event;

  if (event.subtype === 'text') {
    const { intentType } = await recognizer.detectText(channel, event.text, {
      contexts: ['in-flow'],
    });

    if (intentType === 'positive') {
      return bot.render(channel, random(POSITIVE_REPLIES));
    }
    if (intentType === 'negative') {
      return bot.render(channel, random(NEGATIVE_REPLIES));
    }
    if (intentType === 'greeting') {
      return bot.render(channel, random(GREETING_REPLIES));
    }
    if (intentType === 'curse') {
      return bot.render(channel, random(CURSE_REPLIES));
    }
    if (intentType === 'share') {
      return bot.render(channel, <ShareToFriend />);
    }
    if (intentType === 'open') {
      return bot.render(channel, <OwnSpaceCard />);
    }
    return bot.render(
      channel,
      <WhatToDoExpression>
        I'm not pretty sure what do you mean, could you make it clearer?
      </WhatToDoExpression>
    );
  }

  if (event.subtype === 'image') {
    return bot.render(
      channel,
      "I can't store an image note yet 😖, I'll notify you if there are new features available."
    );
  }
  if (event.subtype === 'file') {
    return bot.render(
      channel,
      "I can't store a file yet 😖, I'll notify you if there are new features available."
    );
  }
  if (event.subtype === 'audio') {
    return bot.render(
      channel,
      "I can't store an audio file yet 😖, I'll notify you if there are new features available."
    );
  }
  if (event.subtype === 'video') {
    return bot.render(
      channel,
      "I can't store a video yet 😖, I'll notify you if there are new features available."
    );
  }

  return bot.render(channel, random(UNKNOWN_REPLIES));
};

export default makeContainer({ deps: [DialogFlow.IntentRecognizer] })(
  handleReplyMessage
);
