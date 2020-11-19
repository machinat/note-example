import Machinat from '@machinat/core';
import Base from '@machinat/core/base';
import { container } from '@machinat/core/service';

import { MessengerChat, MessengerBot } from '@machinat/messenger';
import { MarkSeen } from '@machinat/messenger/components';

import { TelegramChat, TelegramBot } from '@machinat/telegram';

import { LineChat, LineBot } from '@machinat/line';

import Script from '@machinat/script';
import { Subject, merge, conditions } from '@machinat/x-machinat';
import { StreamingFrame } from '@machinat/x-machinat/types';
import { filter, mapMetadata, tap } from '@machinat/x-machinat/operators';

import handleStarting from './subscribers/handleStarting';
import handleSocketConnect from './subscribers/handleSocketConnect';
import handleAddNote from './subscribers/handleAddNote';
import handleDeleteNote from './subscribers/handleDeleteNote';
import handleUpdateNote from './subscribers/handleUpdateNote';
import handleReplyMessage from './subscribers/handleReplyMessage';
import handlePostback from './subscribers/handlePostback';
import handleTelegramInlineQuery from './subscribers/handleTelegramInlineQuery';

import { isStarting, isPostback } from './utils';
import type { AppEventContext, AppWebSocketEventContext } from './types';

const main = (events$: Subject<AppEventContext>): void => {
  const webview$ = events$.pipe(
    filter(({ platform }: AppEventContext) => platform === 'web_socket'),
    mapMetadata(
      ({
        scope,
        value: { event, metadata },
      }: StreamingFrame<AppWebSocketEventContext>) => {
        // transform websocket event to source platform
        const { auth } = metadata;
        let originChannel;
        let bot;

        if (auth.platform === 'messenger') {
          const { channel, user } = auth;

          originChannel = channel || MessengerChat.fromUser(user);
          [bot] = scope.useServices([MessengerBot]);
        } else if (auth.platform === 'telegram') {
          const { channel, user, data } = auth;

          originChannel = channel || TelegramChat.fromUser(data.botId, user);
          [bot] = scope.useServices([TelegramBot]);
        } else if (auth.platform === 'line') {
          const { channel, user, data } = auth;

          originChannel = channel || LineChat.fromUser(data.channelId, user);
          [bot] = scope.useServices([LineBot]);
        } else {
          throw Error('unknown auth platform');
        }

        return {
          key: originChannel.uid,
          value: {
            platform: auth.platform,
            bot,
            metadata,
            event: {
              ...event,
              channel: originChannel,
            },
          },
        };
      }
    )
  );

  webview$
    .pipe(filter(({ event }) => event.type === 'connect'))
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
    events$.pipe(
      filter(
        ({ platform }) =>
          platform === 'line' ||
          platform === 'messenger' ||
          platform === 'telegram'
      )
    ),
    webview$
  ).pipe(
    filter(
      container({
        deps: [Base.Bot, Script.Processor],
      })(
        (bot: Base.Bot, scriptProcessor: Script.Processor<any, any>) => async (
          context
        ) => {
          const { kind, channel } = context.event;
          if (
            !channel ||
            (kind !== 'message' &&
              kind !== 'postback' &&
              kind !== 'note_operation')
          ) {
            return true;
          }

          const runtime = await scriptProcessor.continue(channel, context);
          if (!runtime) {
            return true;
          }

          await bot.render(channel, runtime.output());
          return false;
        }
      )
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
          // don't await for it
          bot.render(channel, <MarkSeen />).catch(console.error);
        }
      })
    )
    .subscribe(handleReplyMessage, console.error);

  telegramInlineQuery$.subscribe(handleTelegramInlineQuery, console.error);
};

export default main;
