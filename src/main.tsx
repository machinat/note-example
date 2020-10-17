import Machinat from '@machinat/core';
import Base from '@machinat/core/base';
import { container } from '@machinat/core/service';
import { MessengerChat, MessengerBot } from '@machinat/messenger';
import { MessengerEventContext } from '@machinat/messenger/types';
import { MarkSeen } from '@machinat/messenger/components';
import { LineChat, LineBot } from '@machinat/line';
import { LineEventContext } from '@machinat/line/types';
import Script, { Run } from '@machinat/script';
import { Subject, merge, conditions } from '@machinat/x-machinat';
import { StreamingFrame } from '@machinat/x-machinat/types';
import { filter, mapMetadata, tap } from '@machinat/x-machinat/operators';
import {
  handleSocketConnect,
  handleAddNote,
  handleDeleteNote,
  handleUpdateNote,
  handleReplyMessage,
  handlePostback,
} from './subscribers';
import FirstMeet from './scenes/FirstMeet';
import { isFirstMeet, isPostback } from './utils';
import { LINE_CHANNEL_ID_I } from './interface';
import type { AppEventContext, AppWebSocketEventContext } from './types';

const main = (events$: Subject<AppEventContext>): void => {
  const webview$ = events$.pipe(
    filter(({ platform }: AppEventContext) => platform === 'web_socket'),
    mapMetadata(
      container({ deps: [LINE_CHANNEL_ID_I] })(
        (channelId) => ({
          scope,
          value: { event, metadata },
        }: StreamingFrame<AppWebSocketEventContext>) => {
          // transform websocket event to source platform
          const { user, channel: authChannel } = metadata.auth;

          const noteSpaceChannel =
            authChannel ||
            (user.platform === 'messenger'
              ? MessengerChat.fromUser(user)
              : LineChat.fromUser(channelId, user));

          const [bot] = scope.useServices([
            user.platform === 'messenger' ? MessengerBot : LineBot,
          ]);

          return {
            key: noteSpaceChannel.uid,
            value: {
              platform: user.platform,
              bot,
              metadata,
              event: {
                ...event,
                channel: noteSpaceChannel,
              },
            },
          };
        }
      )
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
      filter(({ platform }) => platform === 'line' || platform === 'messenger')
    ),
    webview$
  ).pipe(
    filter(
      container({
        deps: [Base.Bot, Script.Processor],
      })(
        (bot, scriptProcessor) => async (
          ctx: MessengerEventContext | LineEventContext
        ) => {
          const {
            event: { channel },
          } = ctx;

          const runtime = await scriptProcessor.continue(channel);
          if (!runtime) {
            return true;
          }

          if (channel) {
            await bot.render(channel, <Run runtime={runtime} input={ctx} />);
          }
          return false;
        }
      )
    )
  );

  const [firstMeets$, postbacks$, messages$] = conditions(chatroom$, [
    isFirstMeet,
    isPostback,
    ({ event }) => event.type === 'message',
  ]);

  firstMeets$.subscribe(async ({ bot, event: { channel } }) => {
    await bot.render(channel, <FirstMeet.Start channel={channel} />);
  }, console.error);

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
};

export default main;
