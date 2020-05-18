import { publish } from 'rxjs/operators';
import { filterAsync } from 'rx-machinat/operators';

const isText = ({ event: { type, subtype } }) =>
  type === 'message' && subtype === 'text';

const main = events$ => {
  const chatroom$ = events$.pipe(
    filterAsync(
      ({ platform }) => platform === 'line' || platform === 'messenger'
    )
  );

  chatroom$
    .pipe(filterAsync(isText))
    .subscribe(({ value: { bot, event, channel } }) => {
      bot.render(channel, event.text);
    });

  const gameroom$ = events$.pipe(
    filterAsync(({ platform }) => platform === 'websocket'),
    publish()
  );

  gameroom$
    .pipe(filterAsync(({ event }) => event.type === 'connect'))
    .subscribe(ctx => {
      console.log(ctx);
    });

  gameroom$
    .pipe(filterAsync(({ event }) => event.type === 'query'))
    .subscribe(ctx => {
      console.log(ctx);
    });

  gameroom$
    .pipe(filterAsync(({ event }) => event.type === 'action'))
    .subscribe(ctx => {
      console.log(ctx);
    });

  gameroom$.connect();
};

export default main;
