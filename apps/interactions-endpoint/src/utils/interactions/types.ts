import {
  APIApplicationCommandAutocompleteGuildInteraction,
  APIChatInputApplicationCommandDMInteraction,
  APIChatInputApplicationCommandGuildInteraction,
} from "discord-api-types/v10";
import { Response } from "express";

import { ICurrency, ILanguage, IServer } from "@efg/types";

export type SlashCommand =
  | {
      needsGuild: boolean;
      needsManageGuild: boolean;
      execute: (
        {
          i,
          server,
          language,
          currency,
        }: {
          i:
            | APIChatInputApplicationCommandGuildInteraction
            | APIApplicationCommandAutocompleteGuildInteraction;
          server?: IServer;
          language: ILanguage;
          currency: ICurrency;
        },
        res: Response
      ) => Promise<any>;
    }
  | {
      needsGuild?: never;
      needsManageGuild?: never;
      execute: (
        {
          i,
          language,
          currency,
        }: {
          i: APIChatInputApplicationCommandDMInteraction;
          language: ILanguage;
          currency: ICurrency;
        },
        res: Response
      ) => Promise<any>;
    };
