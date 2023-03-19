use anyhow::Context;
use database::Db;
use ed25519_dalek::{PublicKey, Signature, Verifier};
use twilight_model::{
    application::interaction::{InteractionData, InteractionType},
    http::interaction::InteractionResponseType,
};

use crate::{
    commands::no_guild,
    types::{
        bot::{Currency, Language},
        interaction::{Interaction, InteractionResponse},
    },
};

static PUB_KEY: &str = "30a5ec705e7c46abb11bc46bfe21935538076aad4f04dd2bbdb69eab333b0159";

pub async fn validate_discord_request(
    body: &[u8],
    signature: &str,
    timestamp: &str,
) -> Result<(), anyhow::Error> {
    let pub_key = PublicKey::from_bytes(hex::decode(PUB_KEY).unwrap().as_slice()).unwrap();

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
    db: &Db,
    body: Interaction,
) -> Result<Option<InteractionResponse>, anyhow::Error> {
    if body.kind == InteractionType::Ping {
        return Ok(Some(InteractionResponse {
            data: None,
            kind: InteractionResponseType::Pong,
        }));
    } else {
        let data = match body.data.as_ref() {
            Some(data) => data,
            None => {
                return Ok(None);
            }
        };

        let command_name = match data {
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

        if command_name == "free" {
            return Ok(Some(
                no_guild::free_command::free_command(db, &body, &language, &currency)
                    .await
                    .context("free command failed")?,
            ));
        } else {
            return Ok(None);
        }
    }
}
