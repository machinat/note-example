import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { WHILE, PROMPT, IF, THEN } from '@machinat/script/keywords';
import OpenSpacePanel from '../components/OpenSpacePanel';
import Pause from '../components/Pause';
import SharePanel from '../components/SharePanel';
import PostbackButton from '../components/PostbackButton';
import useEventIntent from '../utils/useEventIntent';
import { INTENT_NO, INTENT_OK } from '../constant';
import { AppEventContext, AppIntentType } from '../types';

type IntroVars = {
  addedNotesCounts: number;
  intentType: undefined | AppIntentType;
  isDone: boolean;
};

const rejectButton = <PostbackButton text="Not Now 🙅" action={INTENT_NO} />;

export default build<IntroVars, AppEventContext>(
  {
    name: 'Introduction',
    initVars: () => ({
      intentType: undefined,
      addedNotesCounts: 0,
      isDone: false,
    }),
  },
  <>
    {() => (
      <>
        I can help you taking notes in chat room 💬
        <Pause />
        <OpenSpacePanel additionalButton={rejectButton}>
          Let's create first note:
        </OpenSpacePanel>
      </>
    )}

    <WHILE<IntroVars>
      condition={({ vars: { isDone, intentType } }) =>
        !isDone && intentType !== INTENT_NO
      }
    >
      <PROMPT<IntroVars, AppEventContext>
        key="add-first-note"
        set={makeContainer({
          deps: [useEventIntent],
        })((getIntent) => async ({ vars }, { event }) => {
          if (event.platform === 'webview') {
            return {
              isDone: event.type === 'disconnect',
              intentType: undefined,
              addedNotesCounts:
                vars.addedNotesCounts + (event.type === 'add_note' ? 1 : 0),
            };
          }

          if (vars.addedNotesCounts > 0) {
            return { ...vars, intentType: undefined, isDone: true };
          }

          const intent = await getIntent(event);
          return { ...vars, intentType: intent.type };
        })}
      />

      {({ vars: { addedNotesCounts, isDone, intentType } }) => {
        if (isDone || intentType === INTENT_NO) {
          return (
            <>
              <p>
                {addedNotesCounts
                  ? `I see you create ${addedNotesCounts} notes 💪`
                  : 'Ok, take a try anytime'}
              </p>
              <p>
                Here is your private space, and the notes are available only by
                you.
              </p>
            </>
          );
        }
        if (intentType !== undefined) {
          return (
            <OpenSpacePanel additionalButton={rejectButton}>
              C'mon, have a try!
            </OpenSpacePanel>
          );
        }
        return null;
      }}
    </WHILE>

    <IF condition={({ platform }) => platform !== 'messenger'}>
      <THEN<IntroVars>>
        {() => (
          <>
            <Pause />
            <SharePanel additionalButton={rejectButton}>
              You can also share notes with friends by adding me to a group
              chat:
            </SharePanel>
          </>
        )}

        <PROMPT<IntroVars, AppEventContext>
          key="wait-for-share"
          set={makeContainer({
            deps: [useEventIntent],
          })((getIntent) => async ({ vars }, { event }) => {
            if (event.platform === 'webview') {
              return { ...vars, intentType: undefined };
            }
            const { type: intentType } = await getIntent(event);
            return { ...vars, intentType };
          })}
        />

        {({ vars }) =>
          vars.intentType === INTENT_OK
            ? 'Thank you!'
            : 'Ok, tell me when you need.'
        }
      </THEN>
    </IF>
  </>
);
