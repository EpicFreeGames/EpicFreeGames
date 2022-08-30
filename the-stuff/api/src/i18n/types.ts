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

  // COMMANDS

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
  cmd_desc_test: "Test if your setup is working";

  // WEBSITE

  tutorial: "Tutorial";
  tutorial_q: "How to setup <botName> to automatically notify about free games?";
  tutorial_1: "Firstly, [get the bot to your server](<inviteLink>).";
  tutorial_2: "Then, set a channel using the `/set channel` command. The bot will use that channel when posting free games.";
  tutorial_3: "And that's it! The bot will send the current free games to the channel you set. You can always test your setup with the `/test` command.";

  having_problems_title: "Having problems?";
  having_problems_desc: "Check out the [frequently asked questions](<faqLink>) or [join our support server](<serverInvite>) and we'll help you out!";

  optional: "optional";

  tutorial_setting_role: "Setting a role";
  tutorial_setting_role_1: "You can set a role the bot will ping when sending the notification. Set it using the `/set role` command.";
  tutorial_setting_role_2: "The role will also get pinged when using the `/test` command, so you can test if everything is working.";

  tutorial_changing_language: "Changing the language";
  tutorial_changing_language_1: "You can change the language the bot uses by using the `/set language` command.";

  tutorial_changing_currency: "Changing the currency";
  tutorial_changing_currency_1: "You can change the currency the bot uses by using the `/set currency` command.";

  faq_title: "Frequently asked questions";
  faq_1_q: "Why is my language not supported?";
  faq_1_a: "Because we don't have a translator for your language. If you'd like to become one, please [join our support server](<serverInvite>) and let us know!";

  faq_2_q: "Why is my currency not supported?";
  faq_2_a: "Please [join our support server](<serverInvite>), let us know, and we'll add it!";

  faq_3_q: "Can everyone change the bot's settings?";
  faq_3_a: "Nope. Only members with the *manage server* permission can change the bot's settings.";

  faq_4_q: "My question is not here...";
  faq_4_a: "Please [join our support server](<serverInvite>) we'll help you out!";

  the_sentence: "Never miss free games again!";

  what_is_bot: "What is <botName>?";
  what_is_bot_desc: "EpicFreeGames is a **customizable** and **easy-to-setup** Discord bot focused around notifying about **free games**. Apart from notifying, it also provides your server some cool [commands](<commandsLink>)!";
  what_is_bot_desc_2: "To get started, set a channel using the `/set channel` command. The bot will use that channel when posting free games.";

  customization: "Customization";
  customization_desc: "You can customize the bot to your liking. **Setup a role** to be pinged on the notifications, change the bot's **language** or even the **currency** of the original prices! Check out the [commands](<commandsLink>) to learn how!";

  get_the_bot: "Get the bot";

  commands: "Commands";
  command: "Command";
  description: "Description";

  commands_modify: "Modify the bot's settings with these commands:";
  commands_modify_desc: "Only for members with the *manage server* permission";
};
