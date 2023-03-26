use data::games::games_types::ApiGame;
use twilight_model::channel::message::Embed;

use crate::types::{
    bot::{Currency, Language},
    embed::{embed_color, EmbedColor},
};

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
