export const joinStrings = (values: string[]) => values.reduce((acc, item, index) => {
  let c = `, ${item}`;
  if (index === 0) {
    c = item;
  }

  return `${acc}${c}`
}, '');

export const getQueryParams = (value: string): { [keys: string]: string } => value
  .substring(1, value.length)
  .split('&')
  .map((item) => item.split('='))
  .reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {}
  )
