import { showNotification, updateNotification } from "@mantine/notifications";
import { Check, CircleX } from "tabler-icons-react";
import { request } from ".";

export const DeployGuildCommands = async () => {
  try {
    showNotification({
      id: "deploy-guild-commands",
      message: "Deploying guild (/) commands",
      loading: true,
    });

    await request({
      path: "/commands/deploy/guild",
      method: "POST",
    });

    updateNotification({
      id: "deploy-guild-commands",
      message: "Guild (/) commands deployed",
      icon: <Check />,
      color: "green",
    });
  } catch (err) {
    console.log(err);

    updateNotification({
      id: "deploy-guild-commands",
      message: "Failed to deploy guild (/) commands",
      icon: <CircleX />,
      color: "red",
    });
  }
};

export const DeployGlobalCommands = async () => {
  try {
    showNotification({
      id: "deploy-global-commands",
      message: "Deploying global (/) commands",
      loading: true,
    });

    await request({
      path: "/commands/deploy/global",
      method: "POST",
    });

    updateNotification({
      id: "deploy-global-commands",
      message: "Global (/) commands deployed",
      icon: <Check />,
      color: "green",
    });
  } catch (err) {
    console.log(err);

    updateNotification({
      id: "deploy-global-commands",
      message: "Failed to deploy global (/) commands",
      icon: <CircleX />,
      color: "red",
    });
  }
};
