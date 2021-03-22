import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';

import { MarkSeen } from '@machinat/messenger/components';
import Script from '@machinat/script';
import { Subject, merge, conditions } from '@machinat/stream';
import { StreamFrame } from '@machinat/stream/types';
import { filter, mapMetadata, tap } from '@machinat/stream/operators';

import handleStarting from './handlers/handleStarting';
import handleSocketConnect from './handlers/handleSocketConnect';
import handleAddNote from './handlers/handleAddNote';
import handleDeleteNote from './handlers/handleDeleteNote';
import handleUpdateNote from './handlers/handleUpdateNote';
import handleReplyMessage from './handlers/handleReplyMessage';
import handlePostback from './handlers/handlePostback';

import isStarting from './utils/isStarting';
import isPostback from './utils/isPostback';
import type { AppEventContext, WebviewActionContext } from './types';

const main = (events$: Subject<AppEventContext>): void => {
  const webview$ = events$.pipe(
    filter(({ platform }: AppEventContext) => platform === 'webview')
  );

  webview$
    .pipe(filter<AppEventContext>(({ event }) => event.type === 'connect'))
    .subscribe(handleSocketConnect);
  webview$
    .pipe(filter(({ event }) => event.type === 'add_note'))
    .subscribe(handleAddNote);
  webview$
    .pipe(filter(({ event }) => event.type === 'delete_note'))
    .subscribe(handleDeleteNote);
  webview$
    .pipe(filter(({ event }) => event.type === 'update_note'))
    .subscribe(handleUpdateNote);

  const chatroom$ = merge(
    events$.pipe(filter(({ platform }) => platform !== 'webview')),
    webview$.pipe(
      mapMetadata(({ value: context }: StreamFrame<WebviewActionContext>) => ({
        key: context.metadata.auth.channel.uid,
        value: context,
      }))
    )
  ).pipe(
    filter<AppEventContext>(
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

  const [firstMeets$, postbacks$, messages$] = conditions(chatroom$, [
    isStarting,
    isPostback,
    ({ event }) => event.kind === 'message',
  ]);

  firstMeets$.subscribe(handleStarting);

  postbacks$.subscribe(handlePostback);

  messages$
    .pipe(
      tap(({ platform, bot, event: { channel } }) => {
        if (platform === 'messenger') {
          // don't await
          bot.render(channel, <MarkSeen />).catch(console.error);
        }
      })
    )
    .subscribe(handleReplyMessage);
};

export default main;
