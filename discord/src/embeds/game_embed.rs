use data::games::games_types::ApiGame;
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use twilight_model::channel::message::Embed;

use crate::types::embed::{embed_color, EmbedColor};

use super::embed_utils::{bold, relatime_timestamp, EMBED_SEPARATOR};

pub fn game_embed(
    game: &ApiGame,
    language: &Language,
    currency: &Currency,
    translator: &Translator,
) -> Embed {
    return Embed {
        color: Some(embed_color(EmbedColor::Gray)),
        title: Some(game.name.clone()),
        description: Some(format!(
            "
            {open_in}:
            {web_link}{separator}{app_link}

            🟢 {game_start}

            🔴 {game_end}

            💰 {price}
            ",
            open_in = bold(translator.translate("open_in", &language, None)),
            web_link = game.web_link.clone(),
            separator = EMBED_SEPARATOR,
            app_link = game.app_link.clone(),
            game_start = relatime_timestamp(&game.start_date),
            game_end = relatime_timestamp(&game.end_date),
            price = game.get_formatted_price(&currency.code),
        )),
        author: None,
        fields: Vec::new(),
        footer: None,
        image: None,
        kind: "rich".to_string(),
        provider: None,
        thumbnail: None,
        timestamp: None,
        url: None,
        video: None,
    };
}

pub fn no_free_games_embed(language: &Language, translator: &Translator) -> Embed {
    return Embed {
        color: Some(embed_color(EmbedColor::Red)),
        title: Some(translator.translate("no_free_games", language, None)),
        description: Some(":(".to_string()),
        author: None,
        fields: Vec::new(),
        footer: None,
        image: None,
        kind: "rich".to_string(),
        provider: None,
        thumbnail: None,
        timestamp: None,
        url: None,
        video: None,
    };
}

pub fn no_upcoming_free_games_embed(language: &Language, translator: &Translator) -> Embed {
    return Embed {
        color: Some(embed_color(EmbedColor::Red)),
        title: Some(translator.translate("no_upcoming_games", language, None)),
        description: Some(":(".to_string()),
        author: None,
        fields: Vec::new(),
        footer: None,
        image: None,
        kind: "rich".to_string(),
        provider: None,
        thumbnail: None,
        timestamp: None,
        url: None,
        video: None,
    };
}
