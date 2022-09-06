export enum InteractionResponseTypes {
  /** ACK a `Ping` */
  Pong = 1,
  /** respond to an interaction with a message */
  ChannelMessageWithSource = 4,
  /** ACK an interaction and edit a response later, the user sees a loading state */
  DeferredChannelMessageWithSource = 5,
  /** for components, ACK an interaction and edit the original message later; the user does not see a loading state */
  DeferredUpdateMessage = 6,
  /** for components, edit the message the component was attached to */
  UpdateMessage = 7,
  /** respond to an autocomplete interaction with suggested choices */
  ApplicationCommandAutocompleteResult = 8,
  /** respond to an interaction with a popup modal */
  Modal = 9,
}

export enum ApplicationCommandTypes {
  /** A text-based command that shows up when a user types `/` */
  ChatInput = 1,
  /** A UI-based command that shows up when you right click or tap on a user */
  User,
  /** A UI-based command that shows up when you right click or tap on a message */
  Message,
}

export enum InteractionTypes {
  Ping = 1,
  ApplicationCommand = 2,
  MessageComponent = 3,
  ApplicationCommandAutocomplete = 4,
  ModalSubmit = 5,
}

export enum ApplicationCommandFlags {
  /** Do not include any embeds when serialising this message */
  SuppressEmbeds = 1 << 2,
  /** Only visible to the user who invoked the interaction */
  Ephemeral = 1 << 6,
}

export enum ApplicationCommandOptionTypes {
  SubCommand = 1,
  SubCommandGroup,
  String,
  Integer,
  Boolean,
  User,
  Channel,
  Role,
  Mentionable,
  Number,
  Attachment,
}

export enum ChannelTypes {
  /** A text channel within a server */
  GuildText,
  /** A direct message between users */
  DM,
  /** A voice channel within a server */
  GuildVoice,
  /** A direct message between multiple users */
  GroupDm,
  /** An organizational category that contains up to 50 channels */
  GuildCategory,
  /** A channel that users can follow and crosspost into their own server */
  GuildAnnouncement,
  /** A temporary sub-channel within a GUILD_ANNOUNCEMENT channel */
  AnnouncementThread = 10,
  /** A temporary sub-channel within a GUILD_TEXT channel */
  PublicThread,
  /** A temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
  PrivateThread,
  /** A voice channel for hosting events with an audience */
  GuildStageVoice,
  /** A channel in a hub containing the listed servers */
  GuildDirectory,
  /** A channel which can only contains threads */
  GuildForum,
}

export type IEmbed = {
  title: string;
  color?: number;
  image?: {
    url: string;
  };
  description: string;
};

export type InteractionResponse = {
  /** The type of response */
  type: InteractionResponseTypes;
  /** An optional response message */
  data?: InteractionApplicationCommandCallbackData;
};

export type InteractionApplicationCommandCallbackData = {
  content?: string;
  embeds?: IEmbed[];
  title?: string;
  flags?: number;
  choices?: ApplicationCommandOptionChoice[];
};

export type ApplicationCommandOptionChoice = {
  /** 1-100 character choice name */
  name: string;
  /** Value of the choice, up to 100 characters if string */
  value: string | number;
};

export enum BitwisePermissionFlags {
  /** Allows creation of instant invites */
  CREATE_INSTANT_INVITE = 0x0000000000000001,
  /** Allows kicking members */
  KICK_MEMBERS = 0x0000000000000002,
  /** Allows banning members */
  BAN_MEMBERS = 0x0000000000000004,
  /** Allows all permissions and bypasses channel permission overwrites */
  ADMINISTRATOR = 0x0000000000000008,
  /** Allows management and editing of channels */
  MANAGE_CHANNELS = 0x0000000000000010,
  /** Allows management and editing of the guild */
  MANAGE_GUILD = 0x0000000000000020,
  /** Allows for the addition of reactions to messages */
  ADD_REACTIONS = 0x0000000000000040,
  /** Allows for viewing of audit logs */
  VIEW_AUDIT_LOG = 0x0000000000000080,
  /** Allows for using priority speaker in a voice channel */
  PRIORITY_SPEAKER = 0x0000000000000100,
  /** Allows the user to go live */
  STREAM = 0x0000000000000200,
  /** Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels */
  VIEW_CHANNEL = 0x0000000000000400,
  /** Allows for sending messages in a channel. (does not allow sending messages in threads) */
  SEND_MESSAGES = 0x0000000000000800,
  /** Allows for sending of /tts messages */
  SEND_TTS_MESSAGES = 0x0000000000001000,
  /** Allows for deletion of other users messages */
  MANAGE_MESSAGES = 0x0000000000002000,
  /** Links sent by users with this permission will be auto-embedded */
  EMBED_LINKS = 0x0000000000004000,
  /** Allows for uploading images and files */
  ATTACH_FILES = 0x0000000000008000,
  /** Allows for reading of message history */
  READ_MESSAGE_HISTORY = 0x0000000000010000,
  /** Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel */
  MENTION_EVERYONE = 0x0000000000020000,
  /** Allows the usage of custom emojis from other servers */
  USE_EXTERNAL_EMOJIS = 0x0000000000040000,
  /** Allows for viewing guild insights */
  VIEW_GUILD_INSIGHTS = 0x0000000000080000,
  /** Allows for joining of a voice channel */
  CONNECT = 0x0000000000100000,
  /** Allows for speaking in a voice channel */
  SPEAK = 0x0000000000200000,
  /** Allows for muting members in a voice channel */
  MUTE_MEMBERS = 0x0000000000400000,
  /** Allows for deafening of members in a voice channel */
  DEAFEN_MEMBERS = 0x0000000000800000,
  /** Allows for moving of members between voice channels */
  MOVE_MEMBERS = 0x0000000001000000,
  /** Allows for using voice-activity-detection in a voice channel */
  USE_VAD = 0x0000000002000000,
  /** Allows for modification of own nickname */
  CHANGE_NICKNAME = 0x0000000004000000,
  /** Allows for modification of other users nicknames */
  MANAGE_NICKNAMES = 0x0000000008000000,
  /** Allows management and editing of roles */
  MANAGE_ROLES = 0x0000000010000000,
  /** Allows management and editing of webhooks */
  MANAGE_WEBHOOKS = 0x0000000020000000,
  /** Allows management and editing of emojis */
  MANAGE_EMOJIS = 0x0000000040000000,
  /** Allows members to use application commands in text channels */
  USE_SLASH_COMMANDS = 0x0000000080000000,
  /** Allows for requesting to speak in stage channels. */
  REQUEST_TO_SPEAK = 0x0000000100000000,
  /** Allows for creating, editing, and deleting scheduled events */
  MANAGE_EVENTS = 0x0000000200000000,
  /** Allows for deleting and archiving threads, and viewing all private threads */
  MANAGE_THREADS = 0x0000000400000000,
  /** Allows for creating public and announcement threads */
  CREATE_PUBLIC_THREADS = 0x0000000800000000,
  /** Allows for creating private threads */
  CREATE_PRIVATE_THREADS = 0x0000001000000000,
  /** Allows the usage of custom stickers from other servers */
  USE_EXTERNAL_STICKERS = 0x0000002000000000,
  /** Allows for sending messages in threads */
  SEND_MESSAGES_IN_THREADS = 0x0000004000000000,
  /** Allows for launching activities (applications with the `EMBEDDED` flag) in a voice channel. */
  USE_EMBEDDED_ACTIVITIES = 0x0000008000000000,
  /** Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels */
  MODERATE_MEMBERS = 0x0000010000000000,
}

export type PermissionString = keyof typeof BitwisePermissionFlags;
