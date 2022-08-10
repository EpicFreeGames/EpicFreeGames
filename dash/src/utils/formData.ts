export const stringifyFormData = (formData: FormData) => {
  // deno-lint-ignore no-explicit-any
  const data: Record<string, any> = {};

  formData.forEach((value, key) => (data[key] = value));

  return JSON.stringify(data);
};
