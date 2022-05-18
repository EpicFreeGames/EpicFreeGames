export const getTag = (body: any) =>
  (body?.member?.user?.username || body?.user?.username) +
  "#" +
  (body?.member?.user?.discriminator || body?.user?.discriminator);
