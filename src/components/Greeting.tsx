import Machinat from '@machinat/core';

const eightHours = 8 * 60 * 60 * 1000;

const Greeting = ({
  firstTime,
  lastTimeVisit,
}: {
  firstTime?: boolean;
  lastTimeVisit?: Date;
}) => {
  if (firstTime) {
    return <p>Hi! Welcome to Note Machina 🤖!</p>;
  }

  if (lastTimeVisit && Date.now() - lastTimeVisit.getTime() < eightHours) {
    return null;
  }

  return <p>Hi!</p>;
};

export default Greeting;
