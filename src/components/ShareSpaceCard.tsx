import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import * as Messenger from '@machinat/messenger/components';
import {
  ENTRY_URL_I,
  FB_PAGE_NAME_I,
  LINE_LIFF_ID_I,
  LINE_OFFICIAL_ACCOUNT_ID_I,
} from '../interface';

const ShareSpaceCard = (entry, fbPageName, liffId, lineOfficialAccountId) => (
  _,
  { platform }
) => {
  const title = '📝 Note Machina 🤖';
  const subtitle = 'A note app for chat room.';

  if (platform === 'line') {
    const liffLocation = `https://liff.line.me/${liffId}`;
    // NOTE: can't share a template in line, use plain text instead
    return (
      <p>
        {title}
        {'\n'}
        {subtitle}
        {'\n\n'}
        Go Chat Space:{'\n'}
        {liffLocation}
        {'\n\n'}
        Lern More:{'\n'}
        {`https://line.me/R/ti/p/${lineOfficialAccountId}`}
      </p>
    );
  }

  const webviewURL = new URL('webview', entry);

  if (platform === 'messenger') {
    webviewURL.searchParams.set('platform', 'messenger');
    const webviewButton = (
      <Messenger.URLButton
        title="Go Chat Space"
        webviewHeightRatio="full"
        url={webviewURL.href}
        messengerExtensions={true}
      />
    );
    return (
      <Messenger.GenericTemplate sharable imageAspectRatio="square">
        <Messenger.GenericItem
          imageURL={`${entry}/webview/static/share_card.png`}
          title={title}
          subtitle={subtitle}
          defaultAction={webviewButton}
          buttons={[
            webviewButton,
            <Messenger.URLButton
              title="Learn More"
              url={`https://m.me/${fbPageName}`}
            />,
          ]}
        />
      </Messenger.GenericTemplate>
    );
  }

  return (
    <p>
      Take notes in Note Machina:
      {'\n\n'}
      {webviewURL.href}
    </p>
  );
};

export default container({
  deps: [
    ENTRY_URL_I,
    FB_PAGE_NAME_I,
    LINE_LIFF_ID_I,
    LINE_OFFICIAL_ACCOUNT_ID_I,
  ],
})(ShareSpaceCard);
