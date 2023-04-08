use std::sync::Arc;

use anyhow::Context;
use config::CONFIG;
use data::types::Data;
use ed25519_dalek::{PublicKey, Signature, Verifier};
use entity::server;
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use sea_orm::EntityTrait;
use twilight_model::{
    application::interaction::{InteractionData, InteractionType},
    http::interaction::InteractionResponseType,
};

use crate::{
    commands::{guild, no_guild},
    types::exports::{HttpClient, Interaction, InteractionResponse},
};

pub async fn validate_discord_request(
    body: &[u8],
    signature: &str,
    timestamp: &str,
) -> Result<(), anyhow::Error> {
    let pub_key =
        PublicKey::from_bytes(hex::decode(&CONFIG.discord_public_key).unwrap().as_slice()).unwrap();

    let decoded_signature_header =
        hex::decode(signature).context("signature is not a valid hex string")?;
    let signature =
        Signature::from_bytes(&decoded_signature_header).context("not a valid signature")?;

    let msg = timestamp
        .as_bytes()
        .iter()
        .chain(body.iter())
        .copied()
        .collect::<Vec<u8>>();

    pub_key
        .verify(&msg, &signature)
        .context("invalid signature")?;

    return Ok(());
}

pub async fn handle_request(
    data: &Data,
    http_client: Arc<HttpClient>,
    translator: &Translator,
    body: Interaction,
) -> Result<Option<InteractionResponse>, anyhow::Error> {
    if body.kind == InteractionType::Ping {
        return Ok(Some(InteractionResponse {
            data: None,
            kind: InteractionResponseType::Pong,
        }));
    } else {
        let interaction_data = match body.data.as_ref() {
            Some(InteractionData::ApplicationCommand(data)) => data,
            _ => {
                return Ok(None);
            }
        };

        let db_server = server::Entity::find_by_id(body.guild_id.unwrap().get() as i64)
            .one(&data.db)
            .await
            .context("Failed to get server from the database")?;

        let (language, currency) = match db_server.clone() {
            Some(server) => {
                let language = match Language::from_code(&server.language_code) {
                    Ok(language) => language,
                    Err(_) => Language::default(),
                };

                let currency = match Currency::from_code(&server.currency_code) {
                    Ok(currency) => currency,
                    Err(_) => Currency::default(),
                };

                (language, currency)
            }
            None => (Language::default(), Currency::default()),
        };

        let command_name = interaction_data.name.as_str();

        tracing::info!(
            "New command: {}, currency: {:?}, language: {:?}",
            command_name,
            currency,
            language
        );

        let response = match command_name {
            "free" => Some(
                no_guild::free_command::free_command(data, translator, &body, &language, &currency)
                    .await
                    .context("free command failed")?,
            ),
            "up" => Some(
                no_guild::up_command::up_command(data, translator, &body, &language, &currency)
                    .await
                    .context("up command failed")?,
            ),
            "help" => Some(
                no_guild::help_command::help_command(translator, &body, &language)
                    .await
                    .context("help command failed")?,
            ),
            "settings" => Some(
                guild::settings_command::settings_command(
                    translator, &db_server, &language, &currency,
                )
                .await
                .context("settings command failed")?,
            ),
            _ => None,
        };

        return Ok(response);
    }
}
