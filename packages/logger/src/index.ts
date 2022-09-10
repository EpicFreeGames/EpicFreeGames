import chalk from "chalk";

import { configuration } from "@efg/configuration";

const l = (...message: any[]) => console.log(...message);
const time = () => `@ ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;

export const logger = {
  error: (...message: any[]) => l("\n" + chalk.red(`[ERROR] ${time()} ::`), ...message),
  success: (...message: any[]) => l("\n" + chalk.green(`[SUCCESS] ${time()} ::`), ...message),
  debug: (...message: any[]) =>
    configuration.DEBUG && l("\n" + chalk.magenta(`[DEBUG] ${time()} ::`), ...message),
  info: (...message: any[]) => l("\n" + chalk.bold(`[INFO] ${time()} ::`), ...message),
};