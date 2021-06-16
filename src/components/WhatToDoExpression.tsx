import Machinat from '@machinat/core';
import Expression from '../components/Expression';
import QuickReply from '../components/QuickReply';
import { INTENT_INTRODUCE, INTENT_OPEN, INTENT_SHARE } from '../constant';

const WhatToDoExpression = ({ children }) => {
  return (
    <Expression
      quickReplies={
        <>
          <QuickReply text="What's this❓" action={INTENT_INTRODUCE} />
          <QuickReply text="Open Notes 📝" action={INTENT_OPEN} />
          <QuickReply text="Share 🔗" action={INTENT_SHARE} />
        </>
      }
    >
      {children}
    </Expression>
  );
};

export default WhatToDoExpression;
