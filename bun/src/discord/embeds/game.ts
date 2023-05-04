import { APIEmbed } from "discord-api-types/v10";

import { Game } from "@/db/schema";

import { Language } from "../i18n/language";
import { embedUtils } from "./_utils";
import { t } from "../i18n/translate";

export function gameEmbed(game: Game, language: Language) {
	return {
		title: game.displayName,
		color: embedUtils.colors.gray,
		image: { url: game.imageUrl },
        description: 
	} satisfies APIEmbed;
}

function links( game: Game, language: Language){
  
    const showSeparator = !!webLink.length;
  
    return (
      embedUtils.bold(t({ language, key: "open_in" })) +
      "\n" +
      game. +
      embedUtils.chars.separator +
      appLink +
      "\n\n"
    );
}