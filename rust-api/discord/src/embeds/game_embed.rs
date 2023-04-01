use data::games::games_types::ApiGame;
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use twilight_model::channel::message::Embed;

use crate::types::embed::{embed_color, EmbedColor};

pub fn game_embed(game: &ApiGame, language: &Language, currency: &Currency) -> Embed {
    return Embed {
        color: Some(embed_color(EmbedColor::Gray)),
        title: Some(game.name.clone()),
        description: Some("testing".to_string()),
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
        title: Some(translator.translate("no_free_games", language)),
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
