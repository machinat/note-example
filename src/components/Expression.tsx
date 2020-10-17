import Machinat from '@machinat/core';
import { MachinatNode } from '@machinat/core/types';
import { Expression as MessengerExpression } from '@machinat/messenger/components';
import { Expression as LineExpression } from '@machinat/line/components';

const Expression = (
  {
    children,
    quickReplies,
  }: {
    children?: MachinatNode;
    quickReplies?: MachinatNode;
  },
  { platform }
) => {
  switch (platform) {
    case 'messenger':
      return (
        <MessengerExpression quickReplies={quickReplies}>
          {children}
        </MessengerExpression>
      );
    case 'line':
      return (
        <LineExpression quickReplies={quickReplies}>{children}</LineExpression>
      );
    default:
      return <>children</>;
  }
};

export default Expression;
