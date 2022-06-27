import Sociably from '@sociably/core';
import { PostbackButton as MessengerPostbackButton } from '@sociably/messenger/components';
import { CallbackButton as TelegramCallbackButton } from '@sociably/telegram/components';
import { PostbackAction as LinePostbackAction } from '@sociably/line/components';
import encodePostbackData from '../utils/encodePostbackData';
import { AppIntentType } from '../types';

type PostbackButtonProps = {
  text: string;
  action: AppIntentType;
};

const Expression = ({ text, action }: PostbackButtonProps, { platform }) => {
  const data = encodePostbackData({ action });

  switch (platform) {
    case 'messenger':
      return <MessengerPostbackButton title={text} payload={data} />;

    case 'telegram':
      return <TelegramCallbackButton text={text} data={data} />;

    case 'line':
      return <LinePostbackAction label={text} displayText={text} data={data} />;

    default:
      return null;
  }
};

export default Expression;
