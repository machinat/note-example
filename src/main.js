import { MessengerChannel } from '@machinat/messenger';
import { LineChannel } from '@machinat/line';
import { publish, map as _map } from 'rxjs/operators';
import { inject } from 'rx-machinat';
import filter from 'rx-machinat/operators/filter';
import {
  handleSocketConnect,
  handleAddNote,
  handleDeleteNote,
  handleUpdateNote,
} from './subscribers';

const main = events$ => {
  const chatroom$ = events$.pipe(
    filter(({ platform }) => platform === 'line' || platform === 'messenger')
  );

  chatroom$
    .pipe(
      filter(
        ({ event: { type, subtype } }) =>
          type === 'message' && subtype === 'text'
      )
    )
    .subscribe(({ value: { bot, event, channel } }) => {
      bot.render(channel, event.text);
    });

  const wallView$ = events$.pipe(
    filter(({ platform }) => platform === 'websocket'),
    _map(({ value: ctx, scope }) => {
      const { channel: connection, user, metadata } = ctx;
      const { platform: authPlatform, sourceChannel } = metadata.auth;

      const wallChannel =
        sourceChannel ||
        (authPlatform === 'messenger'
          ? MessengerChannel.fromUser(user)
          : LineChannel.fromUser(user));

      return {
        value: {
          ...ctx,
          platform: authPlatform,
          channel: wallChannel,
          connection,
        },
        key: wallChannel.uid,
        scope: scope.duplicate(authPlatform),
      };
    }),
    publish()
  );

  wallView$
    .pipe(filter(({ event }) => event.type === 'connect'))
    .subscribe(inject(handleSocketConnect));
  wallView$
    .pipe(filter(({ event }) => event.type === 'add_note'))
    .subscribe(inject(handleAddNote));
  wallView$
    .pipe(filter(({ event }) => event.type === 'delete_note'))
    .subscribe(inject(handleDeleteNote));
  wallView$
    .pipe(filter(({ event }) => event.type === 'update_note'))
    .subscribe(inject(handleUpdateNote));

  wallView$.connect();
};

export default main;
