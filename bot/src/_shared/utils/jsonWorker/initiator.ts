import { DeserializerReturnMessage } from "./deserializer.ts";
import { SerializerReturnMessage } from "./serializer.ts";

export const serialize = (data: Record<string, unknown | string>) =>
  new Promise<string>((resolve, reject) => {
    const worker = new Worker(
      new URL("./serializer.ts", import.meta.url).href,
      { type: "module" }
    );

    worker.onmessage = (event: SerializerReturnMessage) => resolve(event.data);

    worker.onerror = (error) => reject(error);

    worker.postMessage(data);
  });

export const deserialize = <TData>(data: string) =>
  new Promise<TData>((resolve, reject) => {
    const worker = new Worker(
      new URL("./deserializer.ts", import.meta.url).href,
      { type: "module" }
    );

    worker.onmessage = (event: DeserializerReturnMessage<TData>) => {
      const { data } = event;

      resolve(data);
    };

    worker.onerror = (error) => reject(error);

    worker.postMessage(data);
  });
