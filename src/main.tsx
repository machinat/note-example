import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';

import { MarkSeen } from '@machinat/messenger/components';
import Script from '@machinat/script';
import { Subject, merge, conditions } from '@machinat/x-machinat';
import { StreamFrame } from '@machinat/x-machinat/types';
import { filter, mapMetadata, tap } from '@machinat/x-machinat/operators';

import handleStarting from './handlers/handleStarting';
import handleSocketConnect from './handlers/handleSocketConnect';
import handleAddNote from './handlers/handleAddNote';
import handleDeleteNote from './handlers/handleDeleteNote';
import handleUpdateNote from './handlers/handleUpdateNote';
import handleReplyMessage from './handlers/handleReplyMessage';
import handlePostback from './handlers/handlePostback';
import handleTelegramInlineQuery from './handlers/handleTelegramInlineQuery';

import { isStarting, isPostback } from './utils';
import type { AppEventContext, WebAppEventContext } from './types';

const main = (events$: Subject<AppEventContext>): void => {
  const webview$ = events$.pipe(
    filter(({ platform }: AppEventContext) => platform === 'webview')
  );

  webview$
    .pipe(filter<AppEventContext>(({ event }) => event.type === 'connect'))
    .subscribe(handleSocketConnect, console.error);
  webview$
    .pipe(filter(({ event }) => event.type === 'add_note'))
    .subscribe(handleAddNote, console.error);
  webview$
    .pipe(filter(({ event }) => event.type === 'delete_note'))
    .subscribe(handleDeleteNote, console.error);
  webview$
    .pipe(filter(({ event }) => event.type === 'update_note'))
    .subscribe(handleUpdateNote, console.error);

  const chatroom$ = merge(
    events$.pipe(filter(({ platform }) => platform !== 'webview')),
    webview$.pipe(
      mapMetadata(({ value: context }: StreamFrame<WebAppEventContext>) => ({
        key: context.metadata.auth.channel.uid,
        value: context,
      }))
    )
  ).pipe(
    filter(
      makeContainer({
        deps: [Machinat.Bot, Script.Processor] as const,
      })((bot, scriptProcessor) => async (context: AppEventContext) => {
        const channel =
          context.platform === 'webview'
            ? context.metadata.auth.channel
            : context.event.channel;

        if (
          !channel ||
          !['message', 'postback', 'note_action', 'app_action'].includes(
            context.event.kind
          )
        ) {
          return true;
        }

        const runtime = await scriptProcessor.continue(channel, context);
        if (!runtime) {
          return true;
        }

        await bot.render(channel, runtime.output());
        return false;
      })
    )
  );

  const [
    firstMeets$,
    postbacks$,
    messages$,
    telegramInlineQuery$,
  ] = conditions(chatroom$, [
    isStarting,
    isPostback,
    ({ event }) => event.kind === 'message',
    ({ event }) =>
      event.platform === 'telegram' && event.type === 'inline_query',
  ]);

  firstMeets$.subscribe(handleStarting, console.error);

  postbacks$.subscribe(handlePostback, console.error);

  messages$
    .pipe(
      tap(({ platform, bot, event: { channel } }) => {
        if (platform === 'messenger') {
          // don't await
          bot.render(channel, <MarkSeen />).catch(console.error);
        }
      })
    )
    .subscribe(handleReplyMessage, console.error);

  telegramInlineQuery$.subscribe(handleTelegramInlineQuery, console.error);
};

export default main;
