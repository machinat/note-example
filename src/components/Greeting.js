import Machinat from '@machinat/core';

const eightHours = 8 * 60 * 60 * 1000;

const Greeting = ({ firstTime, lastTimeVisit }) => {
  if (firstTime) {
    return <text>Hi! Welcome to Note Machina 🤖!</text>;
  }

  const now = new Date();
  if (now - lastTimeVisit < eightHours) {
    return null;
  }

  return <text>Hi!</text>;
};

export default Greeting;
