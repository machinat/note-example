import Machinat from '@machinat/core';
import DialogFlow from '@machinat/dialogflow';
import { container } from '@machinat/core/service';
import { build, IF, THEN, WHILE, PROMPT, RETURN } from '@machinat/script';
import * as Msgr from '@machinat/messenger/components';
import * as Line from '@machinat/line/components';
import Expression from '../components/Expression';
import OwnSpaceCard from '../components/OwnSpaceCard';
import ShareSpaceCard from '../components/ShareSpaceCard';
import YesOrNoReplies from '../components/YesOrNoReplies';

const handleAddFirstNoteReaction = container({
  deps: [DialogFlow.IntentRecognizer],
})(recognizer => async ({ platform, vars, channel }, { event }) => {
  if (event.type === 'message' && event.subtype === 'text') {
    if (platform === 'messenger' && event.quickReply) {
      if (event.quickReply.payload === 'open') {
        return { ...vars, reactionType: 'open' };
      }
      if (event.quickReply.payload === 'reject') {
        return { ...vars, reactionType: 'reject' };
      }
    }

    const { intent } = await recognizer.recognizeText(channel, event.text, {
      contexts: ['in-flow'],
    });
    const intentName = intent?.displayName;

    if (intentName === 'open' || intentName === 'yes') {
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

  if (platform === 'line' && event.type === 'postback') {
    if (event.data === 'open') {
      return { ...vars, reactionType: 'open' };
    }
    if (event.data === 'reject') {
      return { ...vars, reactionType: 'reject' };
    }
    // NOTE: should flee here
  }

  if (event.type === 'add_note') {
    return { ...vars, reactionType: 'done' };
  }

  if (event.type === 'webview_close') {
    return { ...vars, reactionType: 'cancel' };
  }

  return { ...vars, reactionType: undefined };
});

const handleAskShareFriend = container({
  deps: [DialogFlow.IntentRecognizer],
})(recognizer => async ({ platform, vars, channel }, { event }) => {
  if (event.type === 'message' && event.subtype === 'text') {
    if (platform === 'messenger' && event.quickReply) {
      if (event.quickReply.payload === 'share') {
        return { ...vars, shareAnswer: 'share' };
      }
      if (event.quickReply.payload === 'reject') {
        return { ...vars, shareAnswer: 'reject' };
      }
    }

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

  if (platform === 'line' && event.type === 'postback') {
    if (event.data === 'share') {
      return { ...vars, shareAnswer: 'share' };
    }
    if (event.data === 'reject') {
      return { ...vars, shareAnswer: 'reject' };
    }
    // NOTE: should flee here
  }

  return { ...vars, shareAnswer: 'share' };
});

const openOrRejectReplies = (
  <YesOrNoReplies
    yesText="OK, open my space!"
    yesPayload="open"
    noText="Maybe next time."
    noPayload="reject"
  />
);

const ending = (
  <>
    And that's how Note Machina work! There will be more features in the future,
    I will let you know then.
    <br />
    Enjoy taking notes! 🤩
  </>
);

export default build(
  'Introduction',
  <>
    {() => (
      <>
        <Expression quickReplies={openOrRejectReplies}>
          Note Machina is an app for taking note within chat room 💬.
          <br />
          You can press the "My Space" button at menu 👇 or just tell me to
          "open" the webview to access your own space.
          <br />
          Now let's create a note!
        </Expression>
      </>
    )}

    <WHILE
      condition={({ vars: { reactionType } }) =>
        !reactionType || reactionType === 'open' || reactionType === '?'
      }
    >
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
            yesPayload="share"
            noText="Maybe next time."
            noPayload="reject"
          />
        }
      >
        The notes you created in your own space are only accessible to you.
        <br />
        You can also take notes within other private chat or group chat, and the
        notes are accessible to all the members in the chat room! 💬
        <br />
        Press the "Use w/ Friends" button at menu 👇 or tell me to "share" the
        app with friends.
        <br />
        Wanna have a try?
      </Expression>
    )}

    <PROMPT
      key="ask-share-friend"
      filter={(_, { event }) =>
        event.type === 'message' ||
        (event.platform === 'line' && event.type === 'postback')
      }
      set={handleAskShareFriend}
    />

    <IF condition={({ vars: { shareAnswer } }) => shareAnswer === 'reject'}>
      <THEN>
        {() => {
          return (
            <text>
              OK, just tell me when you need it!
              <br />
              {ending}
            </text>
          );
        }}
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
                <Line.QucikReply
                  action={<Line.MessageAction label="Done!" text="Done!" />}
                />
              ) : null
            }
          >
            Cool! Forward this card to your friends you want to share a note
            space with. 👇
            <ShareSpaceCard />
            {platform === 'messenger'
              ? 'If you\'re using facebook in browser, you might need to "Open in Messenger" to show the forward button.'
              : null}
          </Expression>
        </>
      );
    }}

    <PROMPT
      key="waiting-for-share"
      filter={(_, { event }) =>
        event.type === 'message' ||
        (event.platform === 'line' && event.type === 'postback')
      }
    />

    {() => (
      <text>
        Thank you for sharing! 😍
        <br />
        {ending}
      </text>
    )}
  </>
);
