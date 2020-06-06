import Machinat from '@machinat/core';
import { Expression as MessengerExpression } from '@machinat/messenger/components';
import { Expression as LineExpression } from '@machinat/line/components';

const Expression = ({ children, quickReplies }, { platform }) => {
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
      return children;
  }
};

export default Expression;
