import { fromApp } from '@sociably/stream';
import main from './main';
import createApp from './app';

const app = createApp();
app.onError(console.error);
app
  .start()
  .then(() => {
    main(fromApp(app));
  })
  .catch(console.error);

process.on('unhandledRejection', console.error);
