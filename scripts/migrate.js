import path from 'path';
import Machinat from '@machinat/core';
import Messenger from '@machinat/messenger';
import MessengerAssetManager from '@machinat/messenger/asset';
import Line from '@machinat/line';
import LineAssetManager from '@machinat/line/asset';
import FileState from '@machinat/state/file';
import Umzug from 'umzug';
import commander from 'commander';

const {
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  LINE_PROVIDER_ID,
  LINE_CHANNEL_ID,
  LINE_ACCESS_TOKEN,
  LINE_CHANNEL_SECRET,
} = process.env;

const app = Machinat.createApp({
  platforms: [
    Messenger.initModule({
      webhookPath: '/webhook/messenger',
      pageId: MESSENGER_PAGE_ID,
      appSecret: MESSENGER_APP_SECRET,
      accessToken: MESSENGER_ACCESS_TOKEN,
      verifyToken: MESSENGER_VERIFY_TOKEN,
    }),
    Line.initModule({
      webhookPath: '/webhook/line',
      providerId: LINE_PROVIDER_ID,
      botChannelId: LINE_CHANNEL_ID,
      accessToken: LINE_ACCESS_TOKEN,
      channelSecret: LINE_CHANNEL_SECRET,
    }),
  ],
  modules: [
    FileState.initModule({
      path: './.state_storage',
    }),
  ],
  bindings: [LineAssetManager, MessengerAssetManager],
});

const umzug = new Umzug({
  storage: 'json',
  storageOptions: { path: path.resolve('./.migrated.json') },
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

async function migrate() {
  await app.start();
  if (commander.down) {
    await umzug.down();
  } else {
    await umzug.up();
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
