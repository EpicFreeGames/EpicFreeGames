use entity::server;
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use twilight_model::{
    channel::message::MessageFlags,
    http::interaction::{InteractionResponseData, InteractionResponseType},
};

use crate::{embeds, types::exports::InteractionResponse};

pub async fn settings_command(
    translator: &Translator,
    server: &Option<server::Model>,
    language: &Language,
    curreny: &Currency,
) -> Result<InteractionResponse, anyhow::Error> {
    return Ok(InteractionResponse {
        data: Some(InteractionResponseData {
            flags: Some(MessageFlags::EPHEMERAL),
            embeds: Some(vec![embeds::settings_embed::settings_embed(
                translator, server, language, curreny,
            )]),
            allowed_mentions: None,
            attachments: None,
            choices: None,
            components: None,
            content: None,
            tts: None,
            custom_id: None,
            title: None,
        }),
        kind: InteractionResponseType::ChannelMessageWithSource,
    });
}
