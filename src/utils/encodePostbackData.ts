const encodePostbackData = (payload: Record<string, string>): string => {
  return Object.entries(payload)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export default encodePostbackData;
