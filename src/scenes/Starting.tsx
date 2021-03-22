import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { $, IF, THEN, PROMPT, CALL, RETURN } from '@machinat/script/keywords';

import useIntent from '../utils/useIntent';
import Greeting from '../components/Greeting';
import Expression from '../components/Expression';
import YesOrNoReplies from '../components/YesOrNoReplies';
import type { AppIntentType, AppEventContext } from '../types';
import { INTENT_OK, INTENT_NO } from '../constant';
import Introduction from './Introduction';

type StartingVars = {
  intentType: AppIntentType;
};

export default build<void, StartingVars, AppEventContext>(
  {
    name: 'Starting',
    initVars: () => ({ intentType: INTENT_OK }),
  },
  <$<StartingVars>>
    {() => (
      <Expression
        quickReplies={<YesOrNoReplies yesText="OK!" noText="I already knew." />}
      >
        <Greeting firstTime />
        Would you like to hear introduction?
      </Expression>
    )}

    <PROMPT<StartingVars, AppEventContext>
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

    <IF<StartingVars>
      condition={({ vars: { intentType } }) => intentType === INTENT_NO}
    >
      <THEN>
        {() => <p>Alright, ask me any time if you have any problem. 😊</p>}
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

    {() => <Expression>Hope you enjoy! 🤩</Expression>}
  </$>
);
