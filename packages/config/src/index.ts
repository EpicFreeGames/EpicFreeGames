import { config as userConfig } from "./config.js";
import { config as configTemplate } from "./template.config.js";

import { constants as userConst } from "./constants.js";
import { constants as constTemplate } from "./template.constants.js";

for (let key in configTemplate) {
  if (!userConfig.hasOwnProperty(key) || (typeof userConfig[key] !== "boolean" && !userConfig[key]))
    throw Error(`CONFIG ERROR: '${key}' not set`);
}

for (let key in constTemplate) {
  if (!userConst.hasOwnProperty(key) || !userConst[key])
    throw Error(`CONSTANTS ERROR: '${key}' not set`);

  if (typeof constTemplate[key] === "string" && !userConst[key].length)
    throw Error(`CONSTANTS ERROR: '${key}' not set`);

  for (let subKey in constTemplate[key]) {
    if (!userConst[key].hasOwnProperty(subKey) || !userConst[key][subKey])
      throw Error(`CONSTANTS ERROR: '${key}.${subKey}' not set`);

    if (typeof userConst[key][subKey] !== "string")
      throw Error(`CONSTANTS ERROR: '${key}.${subKey}' must be a string`);
  }
}

export const constants = userConst;
export const config = userConfig;
