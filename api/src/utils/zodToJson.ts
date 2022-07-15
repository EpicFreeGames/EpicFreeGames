import zodToJsonSchema from "zod-to-json-schema";

export const zodToJson = (zodSchema: any) => {
  const name = Math.random().toString(36).substring(2, 15);

  return zodToJsonSchema(zodSchema, name).definitions[name];
};
