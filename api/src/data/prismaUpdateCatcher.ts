export const prismaUpdateCatcher = (err: any) => {
  // Prisma throws on update if the record is not found.
  // This is a workaround to prevent the error from being thrown
  // and instead return null.
  // P2025 is the error code for that error
  if (err?.code === "P2025") return null;

  throw err;
};
