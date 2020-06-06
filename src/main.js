import Machinat from '@machinat/core';
import Base from '@machinat/core/base';
import { container } from '@machinat/core/service';
import { MessengerChannel } from '@machinat/messenger';
import { LineChannel } from '@machinat/line';
import Script from '@machinat/script';
import { merge } from 'rx-machinat';
import { filter, mapMetadata } from 'rx-machinat/operators';
import {
  handleSocketConnect,
  handleAddNote,
  handleDeleteNote,
  handleUpdateNote,
} from './subscribers';
import ShareSpaceCard from './components/ShareSpaceCard';
import FirstMeet from './scenes/FirstMeet';
import { GET_STARTED_POSTBACK_KEY } from './constant';

const isFirstMeet = ({ platform, event }) =>
  (platform === 'messenger' &&
    event.type === 'postback' &&
    event.postback.payload === GET_STARTED_POSTBACK_KEY) ||
  (platform === 'line' && event.type === 'follow');

const main = events$ => {
  const webview$ = events$.pipe(
    filter(({ platform }) => platform === 'websocket'),
    mapMetadata(({ value: ctx, scope }) => {
      // transform websocket event to source platform
      const { channel: connection, user, metadata } = ctx;
      const { platform: authPlatform, sourceChannel } = metadata.auth;

      const wallChannel =
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
          channel: wallChannel,
          connection,
          bot,
        },
        key: wallChannel.uid,
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

  chatroom$
    .pipe(filter(isFirstMeet))
    .subscribe(async ({ bot, channel }) =>
      bot.render(channel, <FirstMeet.Init channel={channel} />)
    );

  chatroom$
    .pipe(
      filter(
        ({ event: { type, subtype } }) =>
          type === 'message' && subtype === 'text'
      )
    )
    .subscribe(({ bot, channel }) => {
      bot.render(channel, <ShareSpaceCard />);
    });
};

export default main;
