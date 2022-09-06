export const getBase64Image = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch the image to be converted to base64\nURL: ${url}`);

  const arrBuff = await res.arrayBuffer();

  return Buffer.from(arrBuff).toString("base64");
};
