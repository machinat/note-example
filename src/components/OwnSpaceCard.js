import Machinat from '@machinat/core';
import { container } from '@machinat/core/service';
import * as Msgr from '@machinat/messenger/components';
import * as Line from '@machinat/line/components';
import { ENTRY_URL_I, LINE_LIFF_ID_I } from '../interface';

const OwnSpaceCard = (entry, liffId) => (_, { platform }) => {
  const indicateWords = 'Open your own Note Machina space 👇';

  if (platform === 'line') {
    const liffLocation = `https://liff.line.me/${liffId}/webview/note?platform=line&fromBotChannel=true`;
    return (
      <Line.ButtonTemplate
        text={indicateWords}
        defaultAction={<Line.URIAction label="Go" uri={liffLocation} />}
        altText={liffLocation}
        actions={<Line.URIAction label="Go" uri={liffLocation} />}
        sharable={false}
      />
    );
  }

  const webviewURL = new URL(`webview/note?platform=${platform}`, entry);

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
      >
        {indicateWords}
      </Msgr.ButtonTemplate>
    );
  }

  return (
    <text>
      {indicateWords}
      {'\n\n'}
      {webviewURL.href}
    </text>
  );
};

export default container({ deps: [ENTRY_URL_I, LINE_LIFF_ID_I] })(OwnSpaceCard);
