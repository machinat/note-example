import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { WHILE, PROMPT, IF, THEN } from '@machinat/script/keywords';
import OpenSpacePanel from '../components/OpenSpacePanel';
import Pause from '../components/Pause';
import SharePanel from '../components/SharePanel';
import PostbackButton from '../components/PostbackButton';
import useIntent from '../services/useIntent';
import { INTENT_NO, INTENT_OK } from '../constant';
import { AppEventContext, AppIntentType } from '../types';

type GuideVars = {
  addedNotesCounts: number;
  intentType: undefined | AppIntentType;
  isDone: boolean;
};

const rejectButton = <PostbackButton text="Got it 👍" action={INTENT_NO} />;

export default build<GuideVars, AppEventContext>(
  {
    name: 'Guide',
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
          Let's create first note! Tap the "Open" button to create a note 👇
        </OpenSpacePanel>
      </>
    )}

    <WHILE<GuideVars>
      condition={({ vars: { isDone, intentType } }) =>
        !isDone && intentType !== INTENT_NO
      }
    >
      <PROMPT<GuideVars, AppEventContext>
        key="add-first-note"
        set={makeContainer({
          deps: [useIntent],
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
                  : 'Ok, you can try it anytime 😊'}
              </p>
              <p>Notes here are available only to you.</p>
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
      <THEN<GuideVars>>
        {() => (
          <>
            <Pause />
            <SharePanel additionalButton={rejectButton}>
              You can also share notes with friends by inviting me to a group
              chat:
            </SharePanel>
          </>
        )}

        <PROMPT<GuideVars, AppEventContext>
          key="wait-for-share"
          set={makeContainer({
            deps: [useIntent],
          })((getIntent) => async ({ vars }, { event }) => {
            if (event.platform === 'webview') {
              return { ...vars, intentType: undefined };
            }
            const { type: intentType } = await getIntent(event);
            return { ...vars, intentType };
          })}
        />

        {({ vars }) =>
          vars.intentType === INTENT_OK ? 'Thank you! 👍' : 'Ok!'
        }
      </THEN>
    </IF>
  </>
);
