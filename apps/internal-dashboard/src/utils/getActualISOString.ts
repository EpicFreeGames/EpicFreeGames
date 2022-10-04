/**
 *
 * @param date
 * @returns An ISO 8601 string (with timezone offset) for the given date
 */
export const getActualISOString = (date: Date) =>
  date.toISOString() + `${date.getTimezoneOffset() ? date.getTimezoneOffset() / 60 : ""}`;
