import { fromEvent } from 'rx-machinat';
import main from './main';
import app from './app';

main(fromEvent(app));

app.onError(console.error);
app.start().catch(console.error);
