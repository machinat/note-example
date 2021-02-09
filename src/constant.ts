import { makeInterface } from '@machinat/core/service';

export const NOTE_SPACE_DATA_KEY = '_NOTE_SPACE_DATA_';

export const MESSENGER_START_ACTION = 'messenger_start';

export const TELEGRAM_REGISTER_CHAT_ACTION = 'telegram_register_chat_instance';

export const ENTRY_URL_I = makeInterface({ name: 'EntryURL' });

export const FB_PAGE_NAME_I = makeInterface({ name: 'FbPageName' });

export const TELEGRAM_BOT_NAME_I = makeInterface({ name: 'TelegramBotName' });

export const LINE_LIFF_ID_I = makeInterface({ name: 'LineLIFFId' });
export const LINE_CHANNEL_ID_I = makeInterface({ name: 'LineChannelId' });

export const LINE_OFFICIAL_ACCOUNT_ID_I = makeInterface({
  name: 'LineOfficialAccountId',
});
