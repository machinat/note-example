import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { MarkSeen } from '@machinat/messenger/components';
import { AnswerCallbackQuery } from '@machinat/telegram/components';
import Script from '@machinat/script';
import { Stream, merge, conditions, StreamingFrame } from '@machinat/stream';
import { filter, mapMetadata, tap } from '@machinat/stream/operators';

import handleStarting from './handlers/handleStarting';
import handleWebviewAction from './handlers/handleWebviewAction';
import handleMessage from './handlers/handleMessage';
import handleGroupEvent from './handlers/handleGroupEvent';
import handlePostback from './handlers/handlePostback';
import isStartingEvent from './utils/isStartingEvent';
import isPostbackEvent from './utils/isPostbackEvent';
import isGroupChat from './utils/isGroupChat';
import type { AppEventContext, WebviewActionContext } from './types';

const main = (events$: Stream<AppEventContext>): void => {
  const nativeChatEvent$ = events$.pipe(
    filter(({ platform }) => platform !== 'webview')
  );
  const webviewAction$ = events$.pipe(
    filter(({ platform }: AppEventContext) => platform === 'webview')
  );

  webviewAction$
    .pipe(tap<AppEventContext>(handleWebviewAction))
    .catch(console.error);

  const chatroomEvent$ = merge(
    nativeChatEvent$,
    webviewAction$.pipe(
      mapMetadata(
        ({ value: context }: StreamingFrame<WebviewActionContext>) => ({
          key: context.metadata.auth.channel.uid,
          value: context,
        })
      )
    )
  ).pipe(
    filter(
      makeContainer({
        deps: [Machinat.Bot, Script.Processor] as const,
      })((bot, scriptProcessor) => async (context: AppEventContext) => {
        const chatChannel =
          context.platform === 'webview'
            ? context.metadata.auth.channel
            : context.event.channel;

        if (
          !chatChannel ||
          isGroupChat(chatChannel) ||
          !['message', 'postback', 'connection', 'webview_action'].includes(
            context.event.category
          )
        ) {
          return true;
        }

        const runtime = await scriptProcessor.continue(chatChannel, context);
        if (!runtime) {
          return true;
        }

        await bot.render(chatChannel, runtime.output());
        return false;
      })
    )
  );

  const [starting$, postback$, groupEvent$, privateMessage$] = conditions(
    chatroomEvent$,
    [
      isStartingEvent,
      isPostbackEvent,
      ({ event }) => isGroupChat(event.channel),
      (ctx) => ctx.event.category === 'message',
    ] as const
  );

  starting$.pipe(tap(handleStarting)).catch(console.error);
  postback$.pipe(tap(handlePostback)).catch(console.error);
  groupEvent$.pipe(tap(handleGroupEvent)).catch(console.error);
  privateMessage$.pipe(tap(handleMessage)).catch(console.error);

  events$.subscribe(async ({ platform, reply }) => {
    if (platform === 'messenger') {
      await reply(<MarkSeen />);
    }
  }, console.error);

  events$.subscribe(async ({ platform, event, reply }) => {
    if (platform === 'telegram' && event.type === 'callback_query') {
      await reply(<AnswerCallbackQuery queryId={event.queryId} />);
    }
  }, console.error);
};

export default main;
