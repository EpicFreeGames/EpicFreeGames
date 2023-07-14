type SorterProps = {
  a: string;
  b: string;
  query: string;
};

export const autoCompleteSorter = ({ a, b, query }: SorterProps) => {
  if (a.indexOf(query) < b.indexOf(query)) return -1;
  else if (a.indexOf(query) > b.indexOf(query)) return 1;
  else return 0;
};

export const makeSenseOfRole = (role: any) => {
  if (role.name === "@everyone") return { embed: "@everyone", toDb: "1" };
  return { embed: `<@&${role.id}>`, toDb: role.id };
};
