import Machinat, { makeContainer } from '@machinat/core';
import { build } from '@machinat/script';
import * as $ from '@machinat/script/keywords';
import useIntent from '../services/useIntent';
import Expression from '../components/Expression';
import QuickReply from '../components/QuickReply';
import WithActions from '../components/WithActions';
import Pause from '../components/Pause';
import type { AppIntentType, AppEventContext } from '../types';
import { INTENT_OK, INTENT_NO } from '../constant';
import Guide from './Guide';

type IntroductionVars = {
  intentType: AppIntentType;
};

export default build<IntroductionVars, AppEventContext>(
  {
    name: 'Introduction',
    initVars: () => ({ intentType: INTENT_OK }),
  },
  <$.BLOCK<IntroductionVars>>
    {() => (
      <Expression
        quickReplies={
          <>
            <QuickReply text="OK!" action={INTENT_OK} />
            <QuickReply text="No, thanks." action={INTENT_NO} />
          </>
        }
      >
        <p>I'm a bot for taking notes 🤖</p>
        <p>Do you like to hear introduction?</p>
      </Expression>
    )}

    <$.PROMPT<IntroductionVars, AppEventContext>
      key="ask-should-intro"
      set={makeContainer({
        deps: [useIntent],
      })((getIntent) => async ({ vars }, { event }) => {
        if (event.platform === 'webview') {
          return vars;
        }

        const intent = await getIntent(event);
        return { intentType: intent.type };
      })}
    />

    <$.IF<IntroductionVars>
      condition={({ vars: { intentType } }) => intentType === INTENT_NO}
    >
      <$.THEN>
        {() => (
          <WithActions>
            <p>Alright, ask me any time! 😊</p>
          </WithActions>
        )}
        <$.RETURN />
      </$.THEN>
    </$.IF>

    {({ vars: { intentType } }) => (
      <p>
        {intentType === INTENT_OK ? 'Cool 👍' : "It won't take too long. 😁"}
      </p>
    )}

    <$.CALL key="guiding" script={Guide} />

    {() => (
      <WithActions>
        <Pause />
        <p>Hope you enjoy!</p>
      </WithActions>
    )}
  </$.BLOCK>
);
