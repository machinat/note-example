import Machinat from '@machinat/core';
import { TypingOn } from '@machinat/messenger/components';

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

const Pause = ({ time = 2000 }, { platform }) => (
  <>
    {platform === 'messenger' ? <TypingOn /> : null}
    {/* @ts-expect-error: microsoft/TypeScript/issues/38367 */}
    <Machinat.Pause until={() => delay(time)} />
  </>
);

export default Pause;
