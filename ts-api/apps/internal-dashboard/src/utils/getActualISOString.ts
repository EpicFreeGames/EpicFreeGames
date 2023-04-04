/**
 *
 * @param date
 * @returns An ISO 8601 string (with timezone offset) for the given date
 */
export const getActualISOString = (date: Date) => {
  const isoString = date.toISOString();
  const timezoneOffset = date.getTimezoneOffset();

  if (!timezoneOffset) {
    return isoString;
  } else {
    const timezoneOffsetHours = Math.abs(timezoneOffset / 60)
      .toString()
      .padStart(2, "0");
    const timezoneOffsetMinutes = Math.abs(timezoneOffset % 60)
      .toString()
      .padStart(2, "0");

    const timezoneOffsetString = `${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
    const timezoneOffsetSign = timezoneOffset > 0 ? "-" : "+";

    return `${isoString.replace("Z", "")}${timezoneOffsetSign}${timezoneOffsetString}`;
  }
};
