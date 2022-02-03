import { makeInterface } from '@machinat/core';

export const EntryUrl = makeInterface<string>({ name: 'EntryURL' });

export const FbPageName = makeInterface<string>({ name: 'FbPageName' });

export const TelegramBotName = makeInterface<string>({
  name: 'TelegramBotName',
});

export const LineLiffId = makeInterface<string>({ name: 'LineLIFFId' });
export const LineChannelId = makeInterface<string>({
  name: 'LineChannelId',
});

export const LineOfficialAccountId = makeInterface<string>({
  name: 'LineOfficialAccountId',
});
