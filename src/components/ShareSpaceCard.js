import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import * as Msgr from '@machinat/messenger/components';
import * as Line from '@machinat/line/components';
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
  const title = '📝 Note Machina';
  const subtitle = 'A note app for chat room.';

  if (platform === 'line') {
    const liffLocation = `https://liff.line.me/${liffId}`;
    const webviewAction = (
      <Line.URIAction label="Go Chat Space" uri={liffLocation} />
    );
    return (
      <Line.ButtonTemplate
        title={title}
        text={subtitle}
        imageURL={`${entry}/webview/static/logo_card1.jpg`}
        imageAspectRatio="square"
        altText={liffLocation}
        defaultAction={webviewAction}
        actions={[
          webviewAction,
          <Line.URIAction
            label="Lern More"
            uri={`https://line.me/R/ti/p/${lineOfficialAccountId}`}
          />,
        ]}
      />
    );
  }

  const webviewURL = new URL('webview/wall', entry);

  if (platform === 'messenger') {
    webviewURL.searchParams.set('platform', 'messenger');
    const webviewButton = (
      <Msgr.URLButton
        title="Go Chat Space"
        webviewHeightRatio="full"
        url={webviewURL.href}
        messengerExtensions={true}
      />
    );
    return (
      <Msgr.GenericTemplate sharable imageAspectRatio="square">
        <Msgr.GenericItem
          imageURL={`${entry}/webview/static/logo_card1.jpg`}
          title={title}
          subtitle={subtitle}
          defaultAction={webviewButton}
          buttons={[
            webviewButton,
            <Msgr.URLButton
              title="Learn More"
              url={`https://m.me/${fbPageName}`}
            />,
          ]}
        />
      </Msgr.GenericTemplate>
    );
  }

  return (
    <text>
      Take notes in Note Machina:
      {'\n\n'}
      {webviewURL.href}
    </text>
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
