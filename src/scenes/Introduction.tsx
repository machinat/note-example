import Machinat from '@machinat/core';
import DialogFlow from '@machinat/dialogflow';
import { container } from '@machinat/core/service';
import { build } from '@machinat/script';
import { IF, THEN, WHILE, PROMPT, RETURN } from '@machinat/script/keywords';
import * as Msgr from '@machinat/messenger/components';
import * as Line from '@machinat/line/components';
import Expression from '../components/Expression';
import OwnSpaceCard from '../components/OwnSpaceCard';
import ShareToFriend from '../components/ShareToFriend';
import YesOrNoReplies from '../components/YesOrNoReplies';
import Pause from '../components/Pause';
import { decodePostbackPayload, encodePostbackPayload } from '../utils';

const handleAddFirstNoteReaction = container({
  deps: [DialogFlow.IntentRecognizer],
})((recognizer) => async ({ platform, vars, channel }, { event }) => {
  if (
    (event.type === 'message' &&
      event.subtype === 'text' &&
      event.quickReply) ||
    (platform === 'line' && event.type === 'postback')
  ) {
    const payload = decodePostbackPayload(
      platform === 'messenger' ? event.quickReply.payload : event.data
    );
    if (payload.action === 'open') {
      return { ...vars, reactionType: 'open' };
    }
    if (payload.action === 'reject') {
      return { ...vars, reactionType: 'reject' };
    }
    return { ...vars, reactionType: '?' };
  }

  if (event.type === 'message' && event.subtype === 'text') {
    const { intent } = await recognizer.recognizeText(channel, event.text, {
      contexts: ['in-flow'],
    });
    const intentName = intent?.displayName;

    if (intentName === 'open' || intentName === 'positive') {
      return { ...vars, reactionType: 'open' };
    }
    if (
      intentName === 'negative' ||
      intentName === 'curse' ||
      intentName === 'skip-in-flow'
    ) {
      return { ...vars, reactionType: 'reject' };
    }
    return { ...vars, reactionType: '?' };
  }

  if (event.type === 'message') {
    return { ...vars, reactionType: '?' };
  }

  if (event.type === 'add_note') {
    return { ...vars, reactionType: 'done' };
  }

  if (event.type === 'webview_close' || event.type === 'disconnect') {
    return { ...vars, reactionType: 'cancel' };
  }

  return { ...vars, reactionType: undefined };
});

const handleAskShareFriend = container({
  deps: [DialogFlow.IntentRecognizer],
})((recognizer) => async ({ platform, vars, channel }, { event }) => {
  if (
    (event.type === 'message' &&
      event.subtype === 'text' &&
      event.quickReply) ||
    (platform === 'line' && event.type === 'postback')
  ) {
    const payload = decodePostbackPayload(
      platform === 'messenger' ? event.quickReply.payload : event.data
    );

    if (payload.action === 'reject') {
      return { ...vars, shareAnswer: 'reject' };
    }
    return { ...vars, shareAnswer: 'share' };
  }

  if (event.type === 'message' && event.subtype === 'text') {
    const { intent } = await recognizer.recognizeText(channel, event.text, {
      contexts: ['in-flow'],
    });
    const intentName = intent?.displayName;

    if (
      intentName === 'negative' ||
      intentName === 'curse' ||
      intentName === 'skip-in-flow'
    ) {
      return { ...vars, shareAnswer: 'reject' };
    }
    return { ...vars, shareAnswer: 'share' };
  }

  return { ...vars, shareAnswer: 'share' };
});

const openOrRejectReplies = (
  <YesOrNoReplies
    yesText="OK, open my space!"
    yesPayload={encodePostbackPayload({
      action: 'open',
      from: 'Introduction',
    })}
    noText="Maybe next time."
    noPayload={encodePostbackPayload({
      action: 'reject',
      from: 'Introduction',
    })}
  />
);

const ending = (
  <>
    And that's how Note Machina work! There will be more features in the future,
    I will let you know then.
    <Pause />
    Hope you enjoy! 🤩
  </>
);

export default build(
  'Introduction',
  <>
    {() => (
      <>
        <Expression quickReplies={openOrRejectReplies}>
          Note Machina is an app for taking note within chat room 💬.
          <Pause />
          You can press the "My Space" button at menu 👇 or just tell me to
          "open" the webview to access your own space.
          <Pause />
          Now let's create a note!
        </Expression>
      </>
    )}

    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <WHILE
      condition={({ vars: { reactionType } }) =>
        !reactionType || reactionType === 'open' || reactionType === '?'
      }
    >
      {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
      <PROMPT key="add-first-note" set={handleAddFirstNoteReaction} />

      {({ vars: { reactionType } }) => {
        switch (reactionType) {
          case 'open':
            return <OwnSpaceCard />;

          case 'done':
            return <text>Well done! 👏 You got you first note! 🎉</text>;

          case 'reject':
            return <text>Oh... maybe next time. 😅</text>;

          case 'cancel':
            return (
              <text>
                You haven't create any note yet..., but you may come back for
                this anytime. 😀
              </text>
            );

          case '?':
            return (
              <Expression quickReplies={openOrRejectReplies}>
                C'mon, have a try!
              </Expression>
            );

          default:
            return null;
        }
      }}
    </WHILE>

    {() => (
      <Expression
        quickReplies={
          <YesOrNoReplies
            yesText="Share to friends!"
            yesPayload={encodePostbackPayload({
              action: 'share',
              from: 'introduction',
            })}
            noText="Maybe next time."
            noPayload={encodePostbackPayload({
              action: 'reject',
              from: 'introduction',
            })}
          />
        }
      >
        The notes you created in your own space are only accessible to you.
        <Pause />
        You can also take notes within other private chat or group chat, and the
        notes are accessible to all the members in the chat room! 💬
        <Pause />
        Press the "Use w/ Friends" button at menu 👇 or tell me to "share" the
        app with friends.
        <Pause />
        Wanna have a try?
      </Expression>
    )}

    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <PROMPT
      key="ask-share-friend"
      filter={(_, { event }) =>
        event.type === 'message' ||
        (event.platform === 'line' && event.type === 'postback')
      }
      set={handleAskShareFriend}
    />

    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <IF condition={({ vars: { shareAnswer } }) => shareAnswer === 'reject'}>
      {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
      <THEN>
        {() => {
          return (
            <Expression>
              OK, just tell me when you need it!
              <Pause />
              {ending}
            </Expression>
          );
        }}
        {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
        <RETURN />
      </THEN>
    </IF>

    {({ platform }) => {
      return (
        <>
          <Expression
            quickReplies={
              platform === 'messenger' ? (
                <Msgr.QuickReply title="Done!" payload="done" />
              ) : platform === 'line' ? (
                <Line.QuickReply
                  action={<Line.MessageAction label="Done!" text="Done!" />}
                />
              ) : null
            }
          >
            Cool! Forward this card to your friends you want to share a note
            space with. 👇
            <ShareToFriend noIndicator />
          </Expression>
        </>
      );
    }}

    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <PROMPT
      key="waiting-for-share"
      filter={(_, { event }) =>
        event.type === 'message' ||
        (event.platform === 'line' && event.type === 'postback')
      }
    />

    {() => (
      <Expression>
        Thank you for sharing! 😍
        <Pause />
        {ending}
      </Expression>
    )}
  </>
);
