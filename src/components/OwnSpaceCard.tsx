import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import * as Msgr from '@machinat/messenger/components';
import * as Line from '@machinat/line/components';
import { ENTRY_URL_I, LINE_LIFF_ID_I } from '../interface';

const OwnSpaceCard = (entry, liffId) => (_, { platform }) => {
  const indicateWords = 'Open your own Note Machina space 👇';

  if (platform === 'line') {
    const liffLocation = `https://liff.line.me/${liffId}?userToBot=true`;
    return (
      <Line.ButtonTemplate
        text={indicateWords}
        defaultAction={<Line.URIAction label="Go" uri={liffLocation} />}
        altText={liffLocation}
        actions={<Line.URIAction label="Go" uri={liffLocation} />}
      />
    );
  }

  const webviewURL = new URL(`webview?platform=${platform}`, entry);

  if (platform === 'messenger') {
    return (
      <Msgr.ButtonTemplate
        buttons={
          <Msgr.URLButton
            title="Go"
            url={webviewURL.href}
            messengerExtensions={true}
          />
        }
        sharable={false}
      >
        {indicateWords}
      </Msgr.ButtonTemplate>
    );
  }

  return (
    <p>
      {indicateWords}
      {'\n\n'}
      {webviewURL.href}
    </p>
  );
};

export default container({ deps: [ENTRY_URL_I, LINE_LIFF_ID_I] })(OwnSpaceCard);
