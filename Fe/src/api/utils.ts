export const check: (value: unknown, message?: string) => asserts value = (value: unknown, message?: string) => {
  if (!value) {
    throw new Error(message);
  }
};

export const toQueryString = (queryObject: {[query: string]: string | number}): string => {
  return Object.keys(queryObject)
    .map(
      (key) =>
        encodeURIComponent(key) + '=' + encodeURIComponent(queryObject[key])
    )
    .join('&');
};