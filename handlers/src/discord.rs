use anyhow::Context;
use data::types::Data;
use discord::{
    http_handlers::handle_request,
    types::interaction::{Interaction, InteractionResponse},
};
use i18n::translator::Translator;

use crate::types::HandlerError;

pub async fn discord_request_handler(
    data: &Data,
    translator: &Translator,
    request_body: Interaction,
) -> Result<Option<InteractionResponse>, HandlerError> {
    let response = handle_request(data, translator, request_body)
        .await
        .context("Failed handling Discord request")?;

    return Ok(response);
}
