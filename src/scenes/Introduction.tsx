import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { WHILE, PROMPT, IF, THEN } from '@machinat/script/keywords';
import Expression from '../components/Expression';
import NoteSpaceCard from '../components/NoteSpaceCard';
import YesOrNoReplies from '../components/YesOrNoReplies';
import Pause from '../components/Pause';
import encodePostbackData from '../utils/encodePostbackData';
import useIntent from '../utils/useIntent';
import { INTENT_OPEN, INTENT_NO } from '../constant';
import { AppEventContext } from '../types';

type IntroVars = {
  createdNotesCounts: number;
  reactionType: undefined | 'done' | 'ok' | 'no';
};

const openOrRejectReplies = (
  <YesOrNoReplies
    yesText="OK, open my space!"
    yesPayload={encodePostbackData({ action: INTENT_OPEN })}
    noText="Maybe next time."
    noPayload={encodePostbackData({ action: INTENT_NO })}
  />
);

export default build<void, IntroVars, AppEventContext>(
  {
    name: 'Introduction',
    initVars: () => ({
      reactionType: undefined,
      createdNotesCounts: 0,
    }),
  },
  <>
    {() => (
      <>
        <Expression quickReplies={openOrRejectReplies}>
          I can help you taking notes in a chat room💬.
          <Pause />
          <NoteSpaceCard>Let's create a note 📝!</NoteSpaceCard>
        </Expression>
      </>
    )}

    <WHILE<IntroVars>
      condition={({ vars: { reactionType } }) =>
        reactionType !== 'no' && reactionType !== 'done'
      }
    >
      <PROMPT<IntroVars, AppEventContext>
        key="add-first-note"
        set={makeContainer({
          deps: [useIntent],
        })(
          (getIntent) => async (
            { vars: { createdNotesCounts } },
            { event }
          ) => {
            if (event.platform === 'webview') {
              return {
                reactionType: event.type === 'disconnect' ? 'done' : undefined,
                createdNotesCounts:
                  createdNotesCounts + (event.type === 'add_note' ? 1 : 0),
              };
            }

            if (createdNotesCounts > 0) {
              return { createdNotesCounts, reactionType: 'done' };
            }

            const intent = await getIntent(event);
            return {
              createdNotesCounts,
              reactionType: intent.type === INTENT_NO ? 'no' : 'ok',
            };
          }
        )}
      />

      {({ vars: { createdNotesCounts, reactionType } }) => {
        switch (reactionType) {
          case 'done':
          case 'no':
            return (
              <p>
                {createdNotesCounts
                  ? `I see you create ${createdNotesCounts} notes 👍`
                  : 'Ok, come back anytime when you need'}
                <br />
                Notes here are in your private space and available by you only!
              </p>
            );
          case 'ok':
            return (
              <Expression quickReplies={openOrRejectReplies}>
                <NoteSpaceCard> C'mon, have a try!</NoteSpaceCard>
              </Expression>
            );
          default:
            return null;
        }
      }}
    </WHILE>

    <IF condition={({ platform }) => platform !== 'messenger'}>
      <THEN>
        {() => (
          <p>You can also have notes shared with friends in group chat.</p>
        )}
      </THEN>
    </IF>

    {() => <Expression>Hope you enjoy! 🤩</Expression>}
  </>
);
