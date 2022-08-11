export const getHtmlDate = (date: string) => {
  const [start, end] = new Date(date).toISOString().split("T");

  return `${start}T${end?.slice(0, 5)}`;
};
