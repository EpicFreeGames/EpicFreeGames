import { translationsType } from "./types";

/**
 * Map<LanguageCode, translations>
 */
export const translations = new Map<string, translationsType>([
  [
    "en",
    {
      tutorial: "Tutorial",
      tutorial_q: "How to setup <botName> to automatically notify about free games?",
      tutorial_1: "Firstly, [get the bot to your server](<inviteLink>).",
      tutorial_2:
        "Then, set a channel using the `/set channel` command. The bot will use that channel when posting free games.",
      tutorial_3:
        "And that's it! The bot will send the current free games to the channel you set. You can always test your setup with the `/test` command.",

      having_problems_title: "Having problems?",
      having_problems_desc:
        "Check out the [frequently asked questions](<faqLink>) or [join our support server](<serverInvite>) and we'll help you out!",

      optional: "optional",

      tutorial_setting_role: "Setting a role",
      tutorial_setting_role_1:
        "You can set a role the bot will ping when sending the notification. Set it using the `/set role` command.",
      tutorial_setting_role_2:
        "The role will also get pinged when using the `/test` command, so you can test if everything is working.",

      tutorial_changing_language: "Changing the language",
      tutorial_changing_language_1:
        "You can change the language the bot uses by using the `/set language` command.",

      tutorial_changing_currency: "Changing the currency",
      tutorial_changing_currency_1:
        "You can change the currency the bot uses by using the `/set currency` command.",

      faq_title: "Frequently asked questions",
      faq_1_q: "Why is my language not supported?",
      faq_1_a:
        "Because we don't have a translator for your language. If you'd like to become one, please [join our support server](<serverInvite>) and let us know!",

      faq_2_q: "Why is my currency not supported?",
      faq_2_a: "Please [join our support server](<serverInvite>), let us know, and we'll add it!",

      faq_3_q: "Can everyone change the bot's settings?",
      faq_3_a:
        "Nope. Only members with the *manage server* permission can change the bot's settings.",

      the_sentence: "Never miss free games again!",

      what_is_bot: "What is <botName>?",
      what_is_bot_desc:
        "EpicFreeGames is a **customizable** and **easy-to-setup** bot focused around notifying about **free games**. Apart from notifying, it also provides your server some cool [commands](<commandsLink>)!",
      what_is_bot_desc_2:
        "To get started, set a channel using the `/set channel` command. The bot will use that channel when posting free games.",

      customization: "Customization",
      customization_desc:
        "You can customize the bot to your liking. **Setup a role** to be pinged on the notifications, change the bot's **language** or even the **currency** of the original prices!",

      check_out_commands: "Check out the [commands](<commandsLink>) to learn how!",

      get_the_bot: "Get the bot",

      commands: "Commands",
    },
  ],
]);
