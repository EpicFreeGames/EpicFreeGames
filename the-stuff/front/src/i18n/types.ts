export const variableStart = "<";
export const variableEnd = ">";

export const linkStart = "[";
export const linkEnd = "]";

export type PathKeys<T> = T extends string
  ? []
  : {
      [K in keyof T]: [K, ...PathKeys<T[K]>];
    }[keyof T];

export type Join<T extends string[], Delimiter extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer Other]
  ? F extends string
    ? `${F}${Delimiter}${Join<Extract<Other, string[]>, Delimiter>}`
    : never
  : string;

export type Trim<A extends string> = A extends ` ${infer B}`
  ? Trim<B>
  : A extends `${infer C} `
  ? Trim<C>
  : A;

export type SearchForVariable<A extends string> =
  A extends `${infer A}${typeof variableStart}${infer B}${typeof variableEnd}${infer C}`
    ? SearchForVariable<A> | Trim<B> | SearchForVariable<C>
    : never;

export type SearchForLink<A extends string> =
  A extends `${infer A}${typeof variableStart}${infer B}${typeof variableEnd}${infer C}`
    ? SearchForLink<A> | Trim<B> | SearchForLink<C>
    : never;

export type Variables<
  // deno-lint-ignore ban-types
  T extends string | object,
  Path extends string,
  Delimiter extends string
> = Path extends `${infer A}${Delimiter}${infer O}`
  ? A extends keyof T
    ? // deno-lint-ignore ban-types
      Variables<Extract<T[A], string | object>, O, Delimiter>
    : never
  : Path extends `${infer A}`
  ? A extends keyof T
    ? SearchForVariable<Extract<T[A], string>>
    : never
  : never;

export type Links<
  // deno-lint-ignore ban-types
  T extends string | object,
  Path extends string,
  Delimiter extends string
> = Path extends `${infer A}${Delimiter}${infer O}`
  ? A extends keyof T
    ? // deno-lint-ignore ban-types
      Links<Extract<T[A], string | object>, O, Delimiter>
    : never
  : Path extends `${infer A}`
  ? A extends keyof T
    ? SearchForLink<Extract<T[A], string>>
    : never
  : never;

export type ILanguage = {
  code: string;
  englishName: string;
  nativeName: string;
};

export type translationsType = {
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

  the_sentence: "Never miss free games again!";

  what_is_bot: "What is <botName>?";
  what_is_bot_desc: "EpicFreeGames is a **customizable** and **easy-to-setup** bot focused around notifying about **free games**. Apart from notifying, it also provides your server some cool [commands](<commandsLink>)!";
  what_is_bot_desc_2: "To get started, set a channel using the `/set channel` command. The bot will use that channel when posting free games.";

  customization: "Customization";
  customization_desc: "You can customize the bot to your liking. **Setup a role** to be pinged on the notifications, change the bot's **language** or even the **currency** of the original prices!";

  check_out_commands: "Check out the [commands](<commandsLink>) to learn how!";

  get_the_bot: "Get the bot";

  commands: "Commands";
};
