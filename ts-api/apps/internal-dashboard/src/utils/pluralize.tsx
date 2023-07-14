export const pluralize = (count: number, singular: string, plural: string, showCount = true) => {
  if (count === 1) {
    return showCount ? `${count} ${singular}` : singular;
  } else {
    return showCount ? `${count} ${plural}` : plural;
  }
};
