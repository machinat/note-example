import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { $, IF, THEN, PROMPT, CALL, RETURN } from '@machinat/script/keywords';

import useEventIntent from '../utils/useEventIntent';
import Greeting from '../components/Greeting';
import Expression from '../components/Expression';
import QuickReply from '../components/QuickReply';
import type { AppIntentType, AppEventContext } from '../types';
import { INTENT_OK, INTENT_NO } from '../constant';
import Introduction from './Introduction';

type StartingVars = {
  intentType: AppIntentType;
};

export default build<StartingVars, AppEventContext>(
  {
    name: 'Starting',
    initVars: () => ({ intentType: INTENT_OK }),
  },
  <$<StartingVars>>
    {() => (
      <Expression
        quickReplies={
          <>
            <QuickReply text="OK!" action={INTENT_OK} />
            <QuickReply text="No, thanks." action={INTENT_NO} />
          </>
        }
      >
        <Greeting firstTime />
        Would you like to hear introduction?
      </Expression>
    )}

    <PROMPT<StartingVars, AppEventContext>
      key="ask-should-intro"
      set={makeContainer({
        deps: [useEventIntent],
      })((getIntent) => async ({ vars }, { event }) => {
        if (event.platform === 'webview') {
          return vars;
        }

        const intent = await getIntent(event);
        return { intentType: intent.type };
      })}
    />

    <IF<StartingVars>
      condition={({ vars: { intentType } }) => intentType === INTENT_NO}
    >
      <THEN>
        {() => <p>Alright, ask me any time 😊</p>}
        <RETURN />
      </THEN>
    </IF>

    {({ vars: { intentType } }) => (
      <p>
        {intentType === INTENT_OK
          ? 'Cool 👍'
          : "Well... It won't take too long. 😁"}
      </p>
    )}

    <CALL key="start-intro" script={Introduction} />

    {() => <p>That's it. Hope you enjoy!</p>}
  </$>
);
