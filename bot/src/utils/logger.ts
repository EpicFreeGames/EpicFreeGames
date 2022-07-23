import { blue, bold, magenta, red } from "colors";

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
    console.log(
      magenta(
        `${bold(`${timestamp()} [DEBUG]`)} ${args
          .map((a) => a.toString())
          .join(" ")}`
      )
    ),

  // deno-lint-ignore no-explicit-any
  error: (...args: any[]) =>
    console.log(
      red(
        `${bold(`${timestamp()} [DEBUG]`)} ${args
          .map((a) => a.toString())
          .join(" ")}`
      )
    ),

  // deno-lint-ignore no-explicit-any
  info: (...args: any[]) =>
    blue(
      `${bold(`${timestamp()} [INFO]`)} ${args
        .map((a) => a.toString())
        .join(" ")}`
    ),
};
