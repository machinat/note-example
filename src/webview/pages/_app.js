import React from 'react';
import App from 'next/app';
import getConfig from 'next/config';
import { fromEventPattern } from 'rxjs';
import WebSocketClient from '@machinat/websocket/client';
import useAuth from '@machinat/websocket/auth/client';
import AuthController from '@machinat/auth/client';
import MessengerAuthorizer from '@machinat/messenger/auth/client';
import LineAuthorizer from '@machinat/line/auth/client';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

let client;
if (typeof window !== 'undefined') {
  const {
    publicRuntimeConfig: {
      fbAppId,
      lineProviderId,
      lineBotChannelId,
      lineLIFFId,
    },
  } = getConfig();

  client = new WebSocketClient({
    url: '/websocket',
    authorizeLogin: useAuth(
      new AuthController({
        serverURL: '/auth',
        providers: [
          new MessengerAuthorizer({
            appId: fbAppId,
          }),
          new LineAuthorizer({
            providerId: lineProviderId,
            botChannelId: lineBotChannelId,
            liffId: lineLIFFId,
          }),
        ],
      })
        .on('error', console.error)
        .bootstrap()
    ),
  });
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: amber,
  },
});

class WallApp extends App {
  constructor(props) {
    super(props);

    this.state = { socket: null };
  }

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    this.setState({ client });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} client={this.state.client} />
      </ThemeProvider>
    );
  }
}

export default WallApp;
