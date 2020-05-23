import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import * as Messenger from '@machinat/messenger/components';
import * as Line from '@machinat/line/components';
import {
  ENTRY_URL_I,
  FB_PAGE_NAME_I,
  LINE_OFFICIAL_ACCOUNT_ID_I,
} from '../interface';

const WebviewLink = (entryURL, fbPageName, lineOfficialAccountId) => (
  _,
  { platform }
) => {
  const url = new URL('webview/wall', entryURL);

  const title = '📝 Note Machina';
  const subtitle = 'A note app in chat room.';

  if (platform === 'messenger') {
    url.searchParams.set('platform', 'messenger');
    const webviewButton = (
      <Messenger.URLButton
        title="Go Chat Space"
        url={url.href}
        extensions={true}
      />
    );
    return (
      <Messenger.GenericTemplate>
        <Messenger.GenericItem
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

  if (platform === 'line') {
    url.searchParams.set('platform', 'line');
    const webviewAction = (
      <Line.URIAction label="Go Chat Space" uri={url.href} />
    );
    return (
      <Line.ButtonTemplate
        title={title}
        text={subtitle}
        altText={url.href}
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

  return url.href;
};

export default container({
  deps: [ENTRY_URL_I, FB_PAGE_NAME_I, LINE_OFFICIAL_ACCOUNT_ID_I],
})(WebviewLink);
