import React from 'react';
import App from 'next/app';
import getConfig from 'next/config';
import { fromEventPattern } from 'rxjs';
import WebSocketClient from '@machinat/websocket/client';
import useAuthorization from '@machinat/websocket/auth/client';
import AuthController from '@machinat/auth/client';
import MessengerAuthorizer from '@machinat/messenger/auth/client';
import LineAuthorizer from '@machinat/line/auth/client';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

// let authController;
// if (typeof window !== 'undefined') {
//   const {
//     publicRuntimeConfig: {
//       fbAppId,
//       lineProviderId,
//       lineBotChannelId,
//       lineLIFFId,
//     },
//   } = getConfig();
//
//   authController = new AuthController({
//     serverURL: '/auth',
//     providers: [
//       new MessengerAuthorizer({
//         appId: fbAppId,
//       }),
//       new LineAuthorizer({
//         providerId: lineProviderId,
//         botChannelId: lineBotChannelId,
//         liffId: lineLIFFId,
//       }),
//     ],
//   });
//   authController.on('error', console.error);
//
//   authController.bootstrap();
// }

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

    //   const client = new WebSocketClient({
    //     url: '/websocket',
    //     authorizeLogin: useAuthorization(authController),
    //   });
    //
    //   this.setState({
    //     socket: {
    //       send: client.send.bind(client),
    //
    //       disconnect: client.disconnect.bind(client),
    //
    //       events$: fromEventPattern(
    //         client.onEvent.bind(client),
    //         client.removeEventListener.bind(client)
    //       ),
    //
    //       errors$: fromEventPattern(
    //         client.onError.bind(client),
    //         client.removeErrorListener.bind(client)
    //       ),
    //     },
    //   });
    //
    //   authController.removeListener('error', console.error);
    //
    //   this.authController = authController;
    //   this.client = client;
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} socket={this.state.socket} />
      </ThemeProvider>
    );
  }
}

export default WallApp;
