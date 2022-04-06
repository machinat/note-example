import { makeInterface } from '@machinat/core';

export const FbPageName = makeInterface<string>({ name: 'FbPageName' });

export const TelegramBotName = makeInterface<string>({
  name: 'TelegramBotName',
});

export const LineOfficialAccountId = makeInterface<string>({
  name: 'LineOfficialAccountId',
});
