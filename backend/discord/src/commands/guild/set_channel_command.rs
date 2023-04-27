use std::{future::IntoFuture, time};

use anyhow::Context;
use config::CONFIG;
use entity::server;
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use twilight_model::{
    application::interaction::application_command::CommandData,
    channel::message::MessageFlags,
    http::interaction::{InteractionResponseData, InteractionResponseType},
};

use crate::types::exports::{HttpClient, Interaction, InteractionResponse};

pub async fn set_channel_command(
    translator: &Translator,
    server: &Option<server::Model>,
    language: &Language,
    curreny: &Currency,
    command_data: &Box<CommandData>,
    interaction: &Interaction,
    http_client: &HttpClient,
) -> Result<(), anyhow::Error> {
    tracing::info!("Deferring response");

    let res = http_client
        .clone()
        .interaction(CONFIG.discord_client_id)
        .create_response(
            interaction.id,
            &interaction.token,
            &InteractionResponse {
                data: Some(InteractionResponseData {
                    flags: Some(MessageFlags::EPHEMERAL),
                    allowed_mentions: None,
                    attachments: None,
                    choices: None,
                    components: None,
                    content: None,
                    custom_id: None,
                    embeds: None,
                    title: None,
                    tts: None,
                }),
                kind: InteractionResponseType::DeferredChannelMessageWithSource,
            },
        )
        .await
        .context("Failed creating response")?;

    tracing::info!("Deferred response, running command, {:?}", res);

    if let Some(channel_option) = command_data.options.get(0) {
        tracing::info!("Channel option: {:?}", channel_option);
    } else {
        tracing::info!("No channel option");
    }

    return Ok(());
}
