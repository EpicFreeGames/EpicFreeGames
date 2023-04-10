use i18n::translator::Translator;
use twilight_model::channel::message::Embed;

use crate::types::embed::{embed_color, EmbedColor};

pub fn generic_error_embed() -> Embed {
    return Embed {
        color: Some(embed_color(EmbedColor::Red)),
        description: Some("An error occured. :( Please try again later.".to_string()),
        title: Some("Error".to_string()),
        kind: "rich".to_string(),
        fields: Vec::new(),
        author: None,
        footer: None,
        image: None,
        provider: None,
        thumbnail: None,
        timestamp: None,
        url: None,
        video: None,
    };
}

pub fn admin_only_command_error_embed(translator: Translator) -> Embed {
    return Embed {
        color: Some(embed_color(EmbedColor::Red)),
        description: Some("test".to_string()),
        title: Some("❌".to_string()),
        kind: "rich".to_string(),
        fields: Vec::new(),
        author: None,
        footer: None,
        image: None,
        provider: None,
        thumbnail: None,
        timestamp: None,
        url: None,
        video: None,
    };
}
