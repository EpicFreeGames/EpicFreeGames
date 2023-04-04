export const displayRole = (role: string) => (role === "1" ? "@everyone" : `<@&${role}>`);
