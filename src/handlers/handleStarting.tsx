import Sociably, { makeContainer } from '@sociably/core';
import WithActions from '../components/WithActions';
import useUserProfile from '../services/useUserProfile';
import Introduction from '../scenes/Introduction';

const handleIntroduction = makeContainer({
  deps: [useUserProfile],
})((getUserProfile) => async ({ reply, event: { user, channel } }) => {
  const { isNewUser, profile } = await getUserProfile(user, channel);

  if (isNewUser) {
    await reply(
      <>
        <p>Hi{profile ? `, ${profile.name}` : ''}! Nice to meet you!</p>
        <Introduction.Start />
      </>
    );
  } else {
    await reply(
      <WithActions>
        Welecome back{profile ? `, ${profile.name}` : ''}! What can I help?
      </WithActions>
    );
  }
});

export default handleIntroduction;
