import Machinat from '@machinat/core';
import DialogFlow from '@machinat/dialogflow';
import { container } from '@machinat/core/service';
import { build } from '@machinat/script';
import { IF, THEN, PROMPT, CALL, RETURN } from '@machinat/script/keywords';

import { decodePostbackPayload } from '../utils';
import Greeting from '../components/Greeting';
import Expression from '../components/Expression';
import YesOrNoReplies from '../components/YesOrNoReplies';

import Introduction from './Introduction';

const handleAskForIntroPrompt = container({
  deps: [DialogFlow.IntentRecognizer],
})((recognizer) => async ({ vars }, { platform, channel, event }) => {
  if (
    (platform === 'messenger' &&
      event.type === 'message' &&
      event.subtype === 'text' &&
      event.quickReply) ||
    (platform === 'line' && event.type === 'postback')
  ) {
    const payload = decodePostbackPayload(
      platform === 'messenger' ? event.quickReply.payload : event.data
    );

    if (payload.action === 'yes' || payload.action === 'no') {
      return {
        ...vars,
        introIntent: { type: payload.action, confidence: 1 },
      };
    }
    return {
      ...vars,
      introIntent: { type: 'yes', confidence: 0 },
    };
  }

  if (event.type === 'message' && event.subtype === 'text') {
    const {
      intent: { displayName: intentName },
      intentDetectionConfidence,
    } = await recognizer.recognizeText(channel, event.text, {
      contexts: ['in-flow'],
    });

    if (
      intentName === 'negative' ||
      intentName === 'curse' ||
      intentName === 'skip-in-flow'
    ) {
      return {
        ...vars,
        introIntent: { type: 'no', confidence: intentDetectionConfidence },
      };
    }

    if (intentName === 'positive') {
      return {
        ...vars,
        introIntent: { type: 'yes', confidence: intentDetectionConfidence },
      };
    }
    // TODO: handle other intent
    return { ...vars, introIntent: { type: 'yes', confidence: 0 } };
  }

  return { ...vars, introIntent: { type: 'yes', confidence: 0 } };
});

export default build(
  'FirstMeet',
  <>
    {() => (
      <Expression
        quickReplies={<YesOrNoReplies yesText="OK!" noText="I already knew." />}
      >
        <Greeting firstTime />
        Would you like to hear introduction?
      </Expression>
    )}

    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <PROMPT key="ask-should-intro" set={handleAskForIntroPrompt} />
    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <IF condition={({ vars: { introIntent } }) => introIntent.type === 'no'}>
      {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
      <THEN>
        {() => (
          <text>Alright, ask me any time if you have any problem. 😊</text>
        )}
        {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
        <RETURN />
      </THEN>
    </IF>
    {({ vars: { introIntent } }) => (
      <text>
        {introIntent.confidence > 0.8
          ? 'Cool 👍'
          : introIntent.confidence > 0.2
          ? "OK! It won't take too long. 😁"
          : "Well... I'll take that as a yes. 😁"}
      </text>
    )}
    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <CALL key="start-intro" script={Introduction} />
  </>
);
