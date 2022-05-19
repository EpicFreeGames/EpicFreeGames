import toast from "react-hot-toast";
import { request } from ".";

export const DeployGuildCommands = async () =>
  toast.promise(
    request({
      path: "/commands/deploy/guild",
      method: "POST",
    }),
    {
      loading: "Deploying guild (/) commands",
      success: "Guild (/) commands deployed",
      error: "Failed to deploy guild (/) commands",
    }
  );

export const DeployGlobalCommands = async () =>
  toast.promise(
    request({
      path: "/commands/deploy/global",
      method: "POST",
    }),
    {
      loading: "Deploying global (/) commands",
      success: "Global (/) commands deployed",
      error: "Failed to deploy global (/) commands",
    }
  );
