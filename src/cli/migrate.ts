import path from 'path';
import Machinat from '@machinat/core';
import Messenger from '@machinat/messenger';
import { MessengerAssetsManager } from '@machinat/messenger/asset';
import Line from '@machinat/line';
import { LineAssetsManager } from '@machinat/line/asset';
import FileState from '@machinat/simple-state/file';
import RedisState from '@machinat/redis-state';
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
          clientOptions: {
            url: REDIS_URL,
          },
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
    LineAssetsManager,

    {
      provide: Messenger.CONFIGS_I,
      withValue: {
        pageId: MESSENGER_PAGE_ID,
        accessToken: MESSENGER_ACCESS_TOKEN,
      },
    },
    Messenger.Bot,
    MessengerAssetsManager,
  ],
});

const umzug = new Umzug({
  storage: new JSONStorage({ path: path.resolve('./.migrated.json') }),
  logging: console.log,
  migrations: {
    params: [app],
    path: path.resolve(__dirname, '../migrations'),
  },
});

commander
  .usage('[options]')
  .option('--down', 'roll back down')
  .parse(process.argv);

(async function migrate() {
  await app.start();

  const [lineBot, messengerBot] = app.useServices([
    Line.Bot,
    Messenger.Bot,
  ] as const);
  lineBot.start();
  messengerBot.start();

  if (commander.down) {
    await umzug.down();
  } else {
    await umzug.up();
  }
})()
  .then(() => {
    const [lineBot, messengerBot, redisClient] = app.useServices([
      Line.Bot,
      Messenger.Bot,
      { require: RedisState.CLIENT_I, optional: true },
    ] as const);

    lineBot.stop();
    messengerBot.stop();
    if (redisClient) {
      redisClient.quit();
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
