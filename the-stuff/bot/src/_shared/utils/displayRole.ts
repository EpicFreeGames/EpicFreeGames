export const displayRole = (roleId?: string | null): string | undefined => {
  let role: string | undefined = undefined;

  if (roleId) {
    if (roleId === "1") {
      role = "@everyone";
    } else {
      role = `<@&${roleId}>`;
    }
  }

  return role;
};
