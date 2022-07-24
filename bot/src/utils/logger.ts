import { blue, bold, magenta, red } from "colors";
import { config } from "../config.ts";

const timestamp = () => {
  const today = new Date();

  const date = today.toLocaleDateString(undefined, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const time = today.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return `${date} @ ${time}`;
};

export const logger = {
  // deno-lint-ignore no-explicit-any
  debug: (...args: any[]) =>
    config.DEBUG && console.debug(...[magenta(`${bold(`${timestamp()} [DEBUG]`)}`), ...args]),

  // deno-lint-ignore no-explicit-any
  error: (...args: any[]) => console.error(...[red(`${bold(`${timestamp()} [ERROR]`)}`), ...args]),

  // deno-lint-ignore no-explicit-any
  info: (...args: any[]) => console.info(...[blue(`${bold(`${timestamp()} [INFO]`)}`), ...args]),
};
