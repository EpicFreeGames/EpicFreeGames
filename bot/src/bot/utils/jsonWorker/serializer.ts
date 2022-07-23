export type SerializerInput = MessageEvent<Record<string, unknown>>;

export type SerializerReturnMessage = MessageEvent<string>;

self.onmessage = (event: SerializerInput) => {
  const { data } = event;

  const serializedData = JSON.stringify(data);

  self.postMessage(serializedData);
};
