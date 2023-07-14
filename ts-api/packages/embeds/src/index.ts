import debug from "./commands/debug";
import help from "./commands/help";
import invite from "./commands/invite";
import settings from "./commands/settings";
import vote from "./commands/vote";
import adminOnlyCommand from "./errors/adminOnlyCommand";
import channelNotSet from "./errors/channelNotSet";
import genericError from "./errors/genericError";
import manageGuildCommand from "./errors/manageGuildCommand";
import maxNumOfWebhooks from "./errors/maxNumOfWebhooks";
import missingPermissions from "./errors/missingPermissions";
import game from "./games/game";
import noFreeGames from "./games/noFreeGames";
import noUpcomingGames from "./games/noUpcomingGames";
import channelSet from "./successes/channelSet";
import currentSettings from "./successes/currentSettings";
import roleSet from "./successes/roleSet";
import updatedSettings from "./successes/updatedSettings";

export const embeds = {
  errors: {
    adminOnlyCommand,
    channelNotSet,
    genericError,
    manageGuildCommand,
    maxNumOfWebhooks,
    missingPermissions,
  },
  successes: {
    currentSettings,
    updatedSettings,
    channelSet,
    roleSet,
  },
  commands: {
    help,
    invite,
    settings,
    vote,
    debug,
  },
  games: {
    game,
    noFreeGames,
    noUpcomingGames,
  },
};
