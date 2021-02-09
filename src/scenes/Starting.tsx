import Machinat from '@machinat/core';
import DialogFlow from '@machinat/dialogflow';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { IF, THEN, PROMPT, CALL, RETURN } from '@machinat/script/keywords';

import { decodePostbackData } from '../utils';
import Greeting from '../components/Greeting';
import Expression from '../components/Expression';
import YesOrNoReplies from '../components/YesOrNoReplies';

import Introduction from './Introduction';

const handleAskForIntroPrompt = makeContainer({
  deps: [DialogFlow.IntentRecognizer],
})(
  (recognizer: DialogFlow.IntentRecognizer) => async (
    { vars },
    { channel, event }
  ) => {
    if (event.type === 'quick_reply' || event.type === 'postback') {
      const payload = decodePostbackData(event.data);

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
      const { intentType, confidence } = await recognizer.detectText(
        channel,
        event.text,
        {
          contexts: ['in-flow'],
        }
      );

      if (
        intentType === 'negative' ||
        intentType === 'curse' ||
        intentType === 'skip-in-flow'
      ) {
        return {
          ...vars,
          introIntent: { type: 'no', confidence },
        };
      }

      if (intentType === 'positive') {
        return {
          ...vars,
          introIntent: { type: 'yes', confidence },
        };
      }
      // TODO: handle other intent
      return { ...vars, introIntent: { type: 'yes', confidence: 0 } };
    }

    return { ...vars, introIntent: { type: 'yes', confidence: 0 } };
  }
);

export default build(
  'Starting',
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
        {() => <p>Alright, ask me any time if you have any problem. 😊</p>}
        {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
        <RETURN />
      </THEN>
    </IF>
    {({ vars: { introIntent } }) => (
      <p>
        {introIntent.confidence > 0.8
          ? 'Cool 👍'
          : introIntent.confidence > 0.2
          ? "OK! It won't take too long. 😁"
          : "Well... I'll take that as a yes. 😁"}
      </p>
    )}
    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <CALL key="start-intro" script={Introduction} />
  </>
);
