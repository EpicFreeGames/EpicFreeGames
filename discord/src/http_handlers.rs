use anyhow::Context;
use config::CONFIG;
use data::{
    games::games_cache::ApiGamesCache,
    types::{Data, Db},
};
use ed25519_dalek::{PublicKey, Signature, Verifier};
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use twilight_model::{
    application::interaction::{InteractionData, InteractionType},
    http::interaction::InteractionResponseType,
};

use crate::{
    commands::no_guild,
    types::interaction::{Interaction, InteractionResponse},
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
    translator: &Translator,
    body: Interaction,
) -> Result<Option<InteractionResponse>, anyhow::Error> {
    if body.kind == InteractionType::Ping {
        return Ok(Some(InteractionResponse {
            data: None,
            kind: InteractionResponseType::Pong,
        }));
    } else {
        let interactionData = match body.data.as_ref() {
            Some(data) => data,
            None => {
                return Ok(None);
            }
        };

        let command_name = match interactionData {
            InteractionData::ApplicationCommand(data) => data.name.as_str(),
            _ => {
                return Ok(None);
            }
        };

        let language = Language {
            name: "English".to_string(),
            code: "en".to_string(),
        };

        let currency = Currency {
            name: "Euro".to_string(),
            code: "EUR".to_string(),
        };

        tracing::info!(
            "New command: {}, currency: {:?}, language: {:?}",
            command_name,
            currency,
            language
        );

        if command_name == "free" {
            return Ok(Some(
                no_guild::free_command::free_command(data, translator, &body, &language, &currency)
                    .await
                    .context("free command failed")?,
            ));
        } else if command_name == "up" {
            return Ok(Some(
                no_guild::up_command::up_command(data, translator, &body, &language, &currency)
                    .await
                    .context("up command failed")?,
            ));
        } else if command_name == "help" {
            return Ok(Some(
                no_guild::help_command::help_command(translator, &body, &language)
                    .await
                    .context("help command failed")?,
            ));
        } else {
            return Ok(None);
        }
    }
}
