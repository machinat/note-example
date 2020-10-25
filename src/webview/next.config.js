const {
  NODE_ENV,
  MESSENGER_APP_ID,
  LINE_LIFF_ID,
  LINE_PROVIDER_ID,
  LINE_BOT_CHANNEL_ID,
} = process.env;

module.exports = {
  distDir: '../../dist',
  assetPrefix: '/webview',
  publicRuntimeConfig: {
    isProduction: NODE_ENV === 'production',
    fbAppId: MESSENGER_APP_ID,
    lineProviderId: LINE_PROVIDER_ID,
    lineBotChannelId: LINE_BOT_CHANNEL_ID,
    lineLIFFId: LINE_LIFF_ID,
  },
};
