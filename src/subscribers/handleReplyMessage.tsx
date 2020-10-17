import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import DialogFlow from '@machinat/dialogflow';
import Expression from '../components/Expression';
import ShareToFriend from '../components/ShareToFriend';
import OwnSpaceCard from '../components/OwnSpaceCard';
import IntroduceQuickReply from '../components/IntroduceQuickReply';
import OpenSpaceQuickReply from '../components/OpenSpaceQuickReply';
import ShareQuickReply from '../components/ShareQuickReply';

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

const handleReplyMessage = (recognizer) => async ({ bot, channel, event }) => {
  if (event.subtype === 'text') {
    const { intent } = await recognizer.recognizeText(channel, event.text, {
      contexts: ['in-flow'],
    });
    const intentName = intent?.displayName;

    if (intentName === 'positive') {
      return bot.render(channel, random(POSITIVE_REPLIES));
    }
    if (intentName === 'negative') {
      return bot.render(channel, random(NEGATIVE_REPLIES));
    }
    if (intentName === 'greeting') {
      return bot.render(channel, random(GREETING_REPLIES));
    }
    if (intentName === 'curse') {
      return bot.render(channel, random(CURSE_REPLIES));
    }
    if (intentName === 'share') {
      return bot.render(channel, <ShareToFriend />);
    }
    if (intentName === 'open') {
      return bot.render(channel, <OwnSpaceCard />);
    }
    return bot.render(
      channel,
      <Expression
        quickReplies={
          <>
            <OpenSpaceQuickReply />
            <ShareQuickReply />
            <IntroduceQuickReply />
          </>
        }
      >
        I'm not pretty sure what do you mean, could you make it clearer?
      </Expression>
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

export default container({ deps: [DialogFlow.IntentRecognizer] })(
  handleReplyMessage
);
