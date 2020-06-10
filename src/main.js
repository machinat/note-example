import Machinat from '@machinat/core';
import Base from '@machinat/core/base';
import { container } from '@machinat/core/service';
import { MessengerChannel, MarkSeen } from '@machinat/messenger';
import { LineChannel } from '@machinat/line';
import Script from '@machinat/script';
import { merge, conditions } from 'rx-machinat';
import { filter, mapMetadata, tap } from 'rx-machinat/operators';
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

const main = events$ => {
  const webview$ = events$.pipe(
    filter(({ platform }) => platform === 'websocket'),
    mapMetadata(({ value: ctx, scope }) => {
      // transform websocket event to source platform
      const { channel: connection, user, metadata } = ctx;
      const { platform: authPlatform, sourceChannel } = metadata.auth;

      const noteSpaceChannel =
        sourceChannel ||
        (authPlatform === 'messenger'
          ? MessengerChannel.fromUser(user)
          : LineChannel.fromUser(user));

      const nativePlatformScope = scope.duplicate(authPlatform);
      const [bot] = nativePlatformScope.useServices([Base.BotI]);

      return {
        value: {
          ...ctx,
          platform: authPlatform,
          channel: noteSpaceChannel,
          connection,
          bot,
        },
        key: noteSpaceChannel.uid,
        scope: nativePlatformScope,
      };
    })
  );

  webview$
    .pipe(filter(({ event }) => event.type === 'connect'))
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
    events$.pipe(
      filter(({ platform }) => platform === 'line' || platform === 'messenger')
    ),
    webview$
  ).pipe(
    filter(
      container({
        deps: [Script.Processor],
      })(scriptProcessor => async ctx => {
        const { bot, channel } = ctx;
        const runtime = await scriptProcessor.continue(channel);
        if (!runtime) {
          return true;
        }

        const { content } = await runtime.run(ctx);
        await bot.render(channel, content);
        await scriptProcessor.save(runtime);

        return false;
      })
    )
  );

  const [firstMeets$, postbacks$, messages$] = conditions(chatroom$, [
    isFirstMeet,
    isPostback,
    ({ event }) => event.type === 'message',
  ]);

  firstMeets$.subscribe(async ({ bot, channel }) => {
    await bot.render(channel, <FirstMeet.Init channel={channel} />);
  });

  postbacks$.subscribe(handlePostback);

  messages$
    .pipe(
      tap(({ platform, bot, channel }) => {
        if (platform === 'messenger') {
          // don't await for it
          bot.render(channel, <MarkSeen />).catch(console.error);
        }
      })
    )
    .subscribe(handleReplyMessage);
};

export default main;
