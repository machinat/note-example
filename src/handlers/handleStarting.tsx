import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import Script from '@machinat/script';
import WithActions from '../components/WithActions';
import useUserProfile from '../services/useUserProfile';
import Introduction from '../scenes/Introduction';

const handleIntroduction = makeContainer({
  deps: [Script.Processor, useUserProfile] as const,
})(
  (processor, getUserProfile) =>
    async ({ reply, event: { user, channel } }) => {
      const { isNewUser, profile } = await getUserProfile(user, channel);

      if (isNewUser) {
        const runtime = await processor.start(channel, Introduction);
        await reply(
          <>
            <p>Hi{profile ? `, ${profile.name}` : ''}! Nice to meet you!</p>
            {runtime.output()}
          </>
        );
      } else {
        await reply(
          <WithActions>
            Welecome back{profile ? `, ${profile.name}` : ''}! What can I help?
          </WithActions>
        );
      }
    }
);

export default handleIntroduction;
