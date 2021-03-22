const decodePostbackData = (data: string): Record<string, string> => {
  return data
    .split(/\s*&\s*/)
    .map((pair) => pair.split(/\s*=\s*/))
    .reduce((obj, [key, value]) => {
      if (key && value) {
        obj[key] = value; // eslint-disable-line  no-param-reassign
      }
      return obj;
    }, {});
};

export default decodePostbackData;
