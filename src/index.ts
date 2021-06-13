import { fromApp } from '@machinat/stream';
import main from './main';
import app from './app';

app
  .onError(console.error)
  .start()
  .then(() => {
    main(fromApp(app));
  })
  .catch(console.error);

process.on('unhandledRejection', console.error);
