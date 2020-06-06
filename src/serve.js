import { fromApp } from 'rx-machinat';
import main from './main';
import app from './app';

main(fromApp(app));

app.onError(console.error);
app.start().catch(console.error);
