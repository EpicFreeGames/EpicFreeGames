// deno-lint-ignore no-explicit-any
export const makeSenseOfRole = (role: any) => {
  if (role.name === "@everyone") return { embed: "@everyone", toDb: "1" };
  return { embed: `<@&${role.id}>`, toDb: role.id };
};
