import { fromApp } from '@machinat/x-machinat';
import main from './main';
import app from './app';

main(fromApp(app));

app.onError(console.error);
app.start().catch(console.error);

process.on('unhandledRejection', console.error);
