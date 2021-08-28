import { makeFactoryProvider } from '@machinat/core/service';
import DialogFlow from '@machinat/dialogflow';
import { INTENT_OK, INTENT_UNKNOWN } from '../constant';
import type { ChatEventContext, AppIntentType } from '../types';
import decodePostbackData from '../utils/decodePostbackData';

type AppIntentResult = {
  type: AppIntentType;
  confidence: number;
  payload: null;
};

const useIntent = makeFactoryProvider({
  lifetime: 'scoped',
  deps: [DialogFlow.IntentRecognizer],
})(
  (recognizer) =>
    async (event: ChatEventContext['event']): Promise<AppIntentResult> => {
      if (
        event.type === 'postback' ||
        event.type === 'callback_query' ||
        event.type === 'quick_reply'
      ) {
        if (!event.data) {
          return {
            type: INTENT_UNKNOWN,
            confidence: 0,
            payload: null,
          };
        }

        const { action } = decodePostbackData(event.data);
        return {
          type: action as AppIntentType,
          confidence: 1,
          payload: null,
        };
      }

      if (event.type === 'text') {
        if (event.text === '👌' || event.text === '👍') {
          return {
            type: INTENT_OK,
            confidence: 1,
            payload: null,
          };
        }

        const intent = await recognizer.detectText(event.channel, event.text);
        return {
          type: (intent.type || INTENT_UNKNOWN) as AppIntentType,
          confidence: intent.confidence,
          payload: null,
        };
      }

      return {
        type: INTENT_UNKNOWN,
        confidence: 0,
        payload: null,
      };
    }
);

export default useIntent;
