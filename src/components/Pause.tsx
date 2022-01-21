import Machinat from '@machinat/core';
import { TypingOn } from '@machinat/messenger/components';

const Pause = ({ time = 2000 }, { platform }) => (
  <>
    {platform === 'messenger' ? <TypingOn /> : null}
    <Machinat.Pause time={time} />
  </>
);

export default Pause;
