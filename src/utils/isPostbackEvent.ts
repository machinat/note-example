import type { AppEventContext, ChatEventContext } from '../../types';

const isPostback = (
  ctx: AppEventContext
): ctx is ChatEventContext & {
  event: { type: 'postback' | 'quick_reply' | 'callback_query' };
} =>
  (ctx.event.platform === 'messenger' &&
    (ctx.event.type === 'postback' || ctx.event.type === 'quick_reply')) ||
  (ctx.event.platform === 'telegram' && ctx.event.type === 'callback_query') ||
  (ctx.event.platform === 'line' && ctx.event.type === 'postback');

export default isPostback;
