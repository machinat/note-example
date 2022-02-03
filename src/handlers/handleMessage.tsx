import Machinat, { makeContainer } from '@machinat/core';
import SharePanel from '../components/SharePanel';
import OpenSpacePanel from '../components/OpenSpacePanel';
import WithActions from '../components/WithActions';
import Introduce from '../scenes/Introduction';
import useIntent from '../services/useIntent';
import {
  INTENT_OK,
  INTENT_NO,
  INTENT_GREETING,
  INTENT_OPEN,
  INTENT_SHARE,
  INTENT_INTRODUCE,
} from '../constant';
import { ChatEventContext } from '../types';

const random = (arr) => arr[Math.floor(arr.length * Math.random())];

const handleMessage = makeContainer({
  deps: [useIntent],
})(
  (getIntent) =>
    async ({
      reply,
      event,
    }: ChatEventContext & { event: { category: 'message' } }) => {
      const intent = await getIntent(event);

      if (intent.type === INTENT_INTRODUCE) {
        return reply(<Introduce.Start channel={event.channel} />);
      }

      if (intent.type === INTENT_SHARE) {
        return reply(<SharePanel />);
      }

      if (intent.type === INTENT_OPEN) {
        return reply(<OpenSpacePanel>Open private notes:</OpenSpacePanel>);
      }

      await reply(
        <WithActions>
          {intent.type === INTENT_OK
            ? random(['👍', '💪', '😊'])
            : intent.type === INTENT_NO
            ? random(['😣', '😖', '🤯'])
            : intent.type === INTENT_GREETING
            ? random(['Hi!', 'Hello!', '🤗'])
            : random(['🧐', '🤔', '😼'])}{' '}
          What can I help?
        </WithActions>
      );
    }
);

export default handleMessage;
