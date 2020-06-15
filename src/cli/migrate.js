import path from 'path';
import Machinat from '@machinat/core';
import Messenger from '@machinat/messenger';
import MessengerAssetRegistry from '@machinat/messenger/asset';
import Line from '@machinat/line';
import LineAssetRegistry from '@machinat/line/asset';
import FileState from '@machinat/state/file';
import RedisState from '@machinat/state/redis';
import YAML from 'yaml';
import { Umzug, JSONStorage } from 'umzug';
import commander from 'commander';

const {
  NODE_ENV,
  REDIS_URL,
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  LINE_PROVIDER_ID,
  LINE_BOT_CHANNEL_ID,
  LINE_ACCESS_TOKEN,
} = process.env;

const DEV = NODE_ENV !== 'production';

const app = Machinat.createApp({
  modules: [
    DEV
      ? FileState.initModule({
          path: './.state_storage',
        })
      : RedisState.initModule({
          url: REDIS_URL,
        }),
  ],
  bindings: [
    { provide: FileState.SerializerI, withValue: YAML },

    {
      provide: Line.CONFIGS_I,
      withValue: {
        providerId: LINE_PROVIDER_ID,
        botChannelId: LINE_BOT_CHANNEL_ID,
        accessToken: LINE_ACCESS_TOKEN,
      },
    },
    Line.Bot,
    LineAssetRegistry,

    {
      provide: Messenger.CONFIGS_I,
      withValue: {
        pageId: MESSENGER_PAGE_ID,
        accessToken: MESSENGER_ACCESS_TOKEN,
      },
    },
    Messenger.Bot,
    MessengerAssetRegistry,
  ],
});

const umzug = new Umzug({
  storage: new JSONStorage({ path: path.resolve('./.migrated.json') }),
  logging: console.log,
  migrations: {
    params: [app],
    path: path.resolve(__dirname, './migrations'),
  },
});

commander
  .usage('[options]')
  .option('--down', 'roll back down')
  .parse(process.argv);

(async function migrate() {
  await app.start();

  const [lineBot, messengerBot] = app.useServices([Line.Bot, Messenger.Bot]);
  lineBot.start();
  messengerBot.start();

  if (commander.down) {
    await umzug.down();
  } else {
    await umzug.up();
  }

  return [lineBot, messengerBot];
})()
  .then(([lineBot, messengerBot]) => {
    lineBot.stop();
    messengerBot.stop();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
