const { MESSENGER_PAGE_ID, TELEGRAM_BOT_NAME, LINE_LIFF_ID } = process.env;

module.exports = {
  distDir: '../dist',
  basePath: '/webview',
  publicRuntimeConfig: {
    MESSENGER_PAGE_ID,
    TELEGRAM_BOT_NAME,
    LINE_LIFF_ID,
  },
};
