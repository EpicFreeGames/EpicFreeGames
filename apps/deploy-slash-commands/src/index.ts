import axios, { AxiosRequestConfig } from "axios";
import { config } from "config";
import { CommandTypes } from "shared";
import { slashCommands } from "./commands";

const discordApiBase = `https://discord.com/api/v9/applications/${config.botId}`;

// if "-g" flag is passed, global commands get deployed
const global = process.argv.includes("-g");

const axiosConfig = (path: string, data?: any): AxiosRequestConfig => {
  return {
    url: `${discordApiBase}${path}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${config.botToken}`,
    },
    data,
  };
};

const globalDeploy = async (commands: any[]) => {
  try {
    console.log(`Global commands: ${commands.map((c) => c.name).join(", ")}`);
    console.log("Deploying global commands...");
    await axios(axiosConfig("/commands", commands));
    console.log("✅ Deployed global commands!");
  } catch (err) {
    console.log("❌ Error deploying global commands:", err.message);
    console.log(JSON.stringify(err.response.data, null, 2));
  }
};

const guildDeploy = async (commands: any[]) => {
  if (!config.guildId) return console.log("Guild ID not set in config, skipping guild deploy...");

  try {
    console.log(`Guild commands: ${commands.map((c) => c.name).join(", ")}`);
    console.log(`Deploying guild commands to ${config.guildId}...`);
    await axios(axiosConfig(`/guilds/${config.guildId}/commands`, commands));
    console.log(`✅ Deployed guild commands to ${config.guildId}!`);
  } catch (err) {
    console.log("❌ Error deploying guild commands:", err.message);
    console.log(JSON.stringify(err.response.data, null, 2));
  }
};

(async () => {
  const guildCommands = [];
  const globalCommands = [];

  for (const command of slashCommands) {
    guildCommands.push(command.data);

    if (command.type === CommandTypes.ADMIN) continue;

    globalCommands.push(command.data);
  }

  guildDeploy(guildCommands);

  if (global && globalCommands.length) {
    globalDeploy(globalCommands);
  }
})();
