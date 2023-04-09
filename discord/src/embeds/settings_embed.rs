use entity::server;
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use twilight_model::channel::message::Embed;

use crate::types::embed::{embed_color, EmbedColor};

use super::embed_utils::bold;

pub fn settings_embed(
    translator: &Translator,
    server: &Option<server::Model>,
    language: &Language,
    currency: &Currency,
) -> Embed {
    return Embed {
        color: Some(embed_color(EmbedColor::Gray)),
        title: Some(translator.translate("settings", language, None)),
        description: Some(format!(
            "
            {channel_or_thread_title}: {channel_or_thread_value}
            
            {role_title}: {role_value}

            {language_title}: {language_value}

            {currency_title}: {currency_value}
            ",
            channel_or_thread_title = bold(format!(
                "{}/{}",
                translator.translate("channel", language, None),
                translator.translate("thread", language, None)
            )),
            channel_or_thread_value =
                handle_channel_or_thread_value(&server, &translator, &language),
            role_title = bold(translator.translate("role", language, None)),
            role_value = handle_role_value(&server, &translator, &language),
            language_title = bold(translator.translate("language", language, None)),
            language_value = language.name,
            currency_title = bold(translator.translate("currency", language, None)),
            currency_value = currency.name,
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

fn handle_channel_or_thread_value(
    server: &Option<server::Model>,
    translator: &Translator,
    language: &Language,
) -> String {
    match server {
        Some(server) => match server.channel_id {
            Some(channel_id) => format!("<#{}>", channel_id),
            None => match server.thread_id {
                Some(thread_id) => format!("<#{}>", thread_id),
                None => translator.translate("channel_thread_not_set", language, None),
            },
        },
        None => translator.translate("channel_thread_not_set", language, None),
    }
}

fn handle_role_value(
    server: &Option<server::Model>,
    translator: &Translator,
    language: &Language,
) -> String {
    match server {
        Some(server) => match server.role_id {
            Some(role_id) => format!("<@&{}>", role_id),
            None => translator.translate("role_not_set", language, None),
        },
        None => translator.translate("role_not_set", language, None),
    }
}
