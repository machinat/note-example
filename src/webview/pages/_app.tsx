import React from 'react';
import NextApp from 'next/app';
import getConfig from 'next/config';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import WebviewClient from '@machinat/webview/client';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';
import amber from '@material-ui/core/colors/amber';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: amber,
  },
});

const { publicRuntimeConfig } = getConfig();

const client = new WebviewClient(
  typeof window === 'undefined'
    ? { mockupMode: true, authorizers: [] }
    : {
        authorizers: [
          new MessengerClientAuthorizer({
            appId: publicRuntimeConfig.messengerAppId,
          }),
          new TelegramClientAuthorizer(),
          new LineClientAuthorizer({
            liffId: publicRuntimeConfig.lineLiffId,
          }),
        ],
      }
);

class NoteApp extends NextApp {
  // to activate publicRuntimeConfig
  static getInitialProps(context) {
    return NextApp.getInitialProps(context);
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (
      jssStyles &&
      jssStyles.parentNode &&
      !publicRuntimeConfig.isProduction
    ) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} client={client} />
      </ThemeProvider>
    );
  }
}

export default NoteApp;
