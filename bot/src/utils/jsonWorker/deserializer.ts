export type DeserializerInput = MessageEvent<string>;

export type DeserializerReturnMessage<TData> = MessageEvent<TData>;

self.onmessage = (event: DeserializerInput) => {
  const { data } = event;

  const deserializedData = JSON.parse(data);

  self.postMessage(deserializedData);
};
