import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import { BaseStateControllerI } from '@machinat/core/base';
import Script from '@machinat/script';
import WhatToDoExpression from '../components/WhatToDoExpression';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import { SpaceData } from '../types';
import Starting from '../scenes/Starting';

const handleStarting = (
  stateController: BaseStateControllerI,
  processor: Script.Processor<any, any>
) => async ({ bot, event: { channel } }) => {
  const hasDataAlready = await stateController
    .channelState(channel)
    .update<SpaceData>(
      NOTE_SPACE_DATA_KEY,
      (data) =>
        data || {
          beginTime: Date.now(),
          idCounter: 0,
          notes: [],
        }
    );

  if (hasDataAlready) {
    await bot.render(
      channel,
      <WhatToDoExpression>Welecome back! What can I help?</WhatToDoExpression>
    );
  } else {
    const runtime = await processor.start(channel, Starting);
    await bot.render(channel, runtime.output());
  }
};

export default container({ deps: [BaseStateControllerI, Script.Processor] })(
  handleStarting
);
