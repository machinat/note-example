import Machinat from '@machinat/core';
import { TypingOn } from '@machinat/messenger/components';

const delay = (t): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, t));

const Pause = ({ time = 2000 }, { platform }) => (
  <>
    {platform === 'messenger' ? <TypingOn /> : null}
    <Machinat.Pause until={() => delay(time)} />
  </>
);

export default Pause;
