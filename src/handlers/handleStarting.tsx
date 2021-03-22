import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import Script from '@machinat/script';
import WhatToDoExpression from '../components/WhatToDoExpression';
import { CHAT_INFO_KEY } from '../constant';
import { ChatInfoState } from '../types';
import Starting from '../scenes/Starting';

const handleStarting = (
  stateController: StateController,
  processor: Script.Processor<typeof Starting>
) => async ({ bot, event: { channel } }) => {
  const hasDataAlready = await stateController
    .channelState(channel)
    .update<ChatInfoState>(CHAT_INFO_KEY, (data) => {
      if (data) {
        return data;
      }

      const now = Date.now();
      return {
        beginAt: now,
        updateAt: now,
        name: undefined,
        avatar: undefined,
        memberUids: undefined,
      };
    });

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
