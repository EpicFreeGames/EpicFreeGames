export type ICurrency = {
  code: string;
  afterPrice: string;
  inFrontOfPrice: string;
  apiValue: string;
  name: string;
};

export type ILanguage = {
  code: string;
  englishName: string;
  nativeName: string;
};

export const variableStart = "<";
export const variableEnd = ">";

export type translationsType = {
  support_click_here: "Click here to get support";
  vote_needed_title: "You need to vote to use this command";
  vote_click_here: "Click here to vote for me on top.gg";
  commands_listed: "You can find all my commands listed here";

  set_channel_first: "You have to set a channel first!";

  no_free_games: "No free games at the moment";
  no_upcoming_games: "No upcoming free games at the moment";

  make_sure_perms: "Make sure I have these permissions on <channel>:";
  user_missing_perms: "You don't have enough permissions to use this command";
  manage_guild_needed: "This command requires you to have the **manage server** permission";
  bot_admins_only: "This command requires you to be one of the bot admins";

  manage_webhooks: "Manage webhooks";

  role_set_success_desc: "I'll mention/ping <role> when notifying about free games!";
  channel_thread_set_success_desc: "I'll start notifying about free games on <channel>!";

  channel_thread_remove_success_desc: "I'll no longer notify about free games on this server.";
  role_remove_success_desc: "I'll no longer mention/ping <role> when notifying about free games";

  updated_settings: "Here are the updated settings:";
  current_settings: "Here are the current settings:";

  channel_thread_not_set: "Not set, you can set one with `/set channel` or `/set thread`";
  role_not_set: "Not set, you can set one with `/set role`";

  too_many_webhooks: "Too many webhooks";
  ten_webhooks_only: "A channel can have 10 webhooks at most. Please remove one, and try again.";

  would_you_like_to_translate: "Would you like to help translating <botName>?";
  if_would_like_to_translate: "If so, please let us know on our [support server](<serverInvite>)!";

  having_problems: "Having problems? Let us know on our [support server](<serverInvite>) and we'll help you out!";
  how_to_tutorial: "How to get automatically notified of free games? [Click here](<tutorialLink>) for a tutorial!";

  looking_for_commands: "Looking for commands? [Click here](<commandsLink>) for my command list!";
  help_desc: "I'm a customizable bot focused around notifying servers about free games. Thank you for choosing me!";

  open_in: "Open in:";
  free: "Free";

  invite: "Invite";
  vote: "Vote";
  support: "Support";
  website: "Website";

  channel: "Channel";
  thread: "Thread";
  role: "Role";
  language: "Language";
  currency: "Currency";

  settings: "Settings";
  help: "Help";
  missing: "Missing!";

  thank_you: "Thank you!";

  webhooks_notification: "I support webhooks nowadays! They allow me to send the notifications a lot faster. Server admins, please do `/set channel` (or `/set thread`) to enable notifications through webhooks.";
  slash_notification: "Slash (/) commands not working? (Click here) to add the bot again to your server with the slash commands enabled. (Kicking is not required)";

  cmd_desc_set_currency: "Pick a currency you'd like the prices to be in";
  cmd_desc_set_thread: "Pick a thread I'll post new free games on";
  cmd_desc_set_channel: "Pick a channel I'll post new free games on";
  cmd_desc_set_role: "Pick a role I'll ping when a new game comes free!";
  cmd_desc_set_language: "Pick a language you'd like my messages to be in";
  cmd_desc_remove_channel: "Remove the set channel (or thread)";
  cmd_desc_remove_role: "Remove the set role";
  cmd_desc_invite: "Get my invite link";
  cmd_desc_help: "Use this if you need some help";
  cmd_desc_debug: "Used for debugging";
  cmd_desc_up: "See the upcoming free games";
  cmd_desc_free: "See the current free games";
  cmd_desc_settings: "See the settings";
  cmd_desc_vote: "Vote for me";
};
