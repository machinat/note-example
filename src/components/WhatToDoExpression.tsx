import Machinat from '@machinat/core';
import Expression from '../components/Expression';
import IntroduceQuickReply from '../components/IntroduceQuickReply';
import OpenSpaceQuickReply from '../components/OpenSpaceQuickReply';
import ShareQuickReply from '../components/ShareQuickReply';

const WhatToDoExpression = ({ children }) => {
  return (
    <Expression
      quickReplies={
        <>
          <OpenSpaceQuickReply />
          <ShareQuickReply />
          <IntroduceQuickReply />
        </>
      }
    >
      {children}
    </Expression>
  );
};

export default WhatToDoExpression;
