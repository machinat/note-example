#!/usr/bin/env node
import { config as configEnv } from 'dotenv';
import { resolve as resolvePath } from 'path';
import Machinat from '@machinat/core';
import Messenger from '@machinat/messenger';
import MessengerAssetsManager from '@machinat/messenger/asset';
import Telegram from '@machinat/telegram';
import Line from '@machinat/line';
import LineAssetsManager from '@machinat/line/asset';
import FileState from '@machinat/local-state/file';
import RedisState from '@machinat/redis-state';
import { Umzug, JSONStorage } from 'umzug';
import commander from 'commander';

configEnv();
const {
  NODE_ENV,
  REDIS_URL,
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  TELEGRAM_BOT_TOKEN,
  LINE_PROVIDER_ID,
  LINE_CHANNEL_ID,
  LINE_ACCESS_TOKEN,
} = process.env as Record<string, string>;

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
  platforms: [
    Messenger.initModule({
      pageId: Number(MESSENGER_PAGE_ID),
      accessToken: MESSENGER_ACCESS_TOKEN,
      noServer: true,
    }),
    Telegram.initModule({
      botToken: TELEGRAM_BOT_TOKEN,
      noServer: true,
    }),
    Line.initModule({
      providerId: LINE_PROVIDER_ID,
      channelId: LINE_CHANNEL_ID,
      accessToken: LINE_ACCESS_TOKEN,
      noServer: true,
    }),
  ],
  services: [LineAssetsManager, MessengerAssetsManager],
});

const umzug = new Umzug({
  storage: new JSONStorage({ path: resolvePath('./.migrated.json') }),
  logger: console,
  migrations: {
    glob: resolvePath(__dirname, '../migrations/*.+(js|ts)'),
    resolve: ({ name, path }) => {
      return {
        name: name.replace(/.[t|j]s$/, ''),
        up: async () => {
          const { up } = await import(path as string);
          if (up) {
            const scope = app.serviceSpace.createScope();
            await scope.injectContainer(up);
          }
        },
        down: async () => {
          const { down } = await import(path as string);
          if (down) {
            const scope = app.serviceSpace.createScope();
            await scope.injectContainer(down);
          }
        },
      };
    },
  },
});

commander
  .usage('[options]')
  .option('--down', 'roll back down')
  .parse(process.argv);

(async function migrate() {
  await app.start();

  if (commander.down) {
    await umzug.down();
  } else {
    await umzug.up();
  }

  await app.stop();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
