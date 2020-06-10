import Machinat from '@machinat/core';
import ShareSpaceCard from './ShareSpaceCard';
import Pause from './Pause';

const ShareToFriend = ({ noIndicator = false }, { platform }) => {
  return (
    <>
      {noIndicator
        ? null
        : 'Please forward this card 👇 to your friend or group.'}
      <ShareSpaceCard />
      <Pause />
      {platform === 'messenger' ? (
        <text>
          If you're using facebook in browser, you might need to "Open in
          Messenger" to show the forward button.
        </text>
      ) : null}
    </>
  );
};

export default ShareToFriend;
