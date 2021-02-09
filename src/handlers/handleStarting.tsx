import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import Script from '@machinat/script';
import WhatToDoExpression from '../components/WhatToDoExpression';
import { NOTE_SPACE_DATA_KEY } from '../constant';
import { ChannelState } from '../types';
import Starting from '../scenes/Starting';

const handleStarting = (
  stateController: StateController,
  processor: Script.Processor<any, any>
) => async ({ bot, event: { channel } }) => {
  const hasDataAlready = await stateController
    .channelState(channel)
    .update<ChannelState>(
      NOTE_SPACE_DATA_KEY,
      (data) =>
        data || {
          chatBeginAt: Date.now(),
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

export default makeContainer({
  deps: [StateController, Script.Processor],
})(handleStarting);
