use anyhow::Context;
use database::Db;
use discord::{
    http_handlers::handle_request,
    types::interaction::{Interaction, InteractionResponse},
};

use crate::types::HandlerError;

pub async fn discord_request_handler(
    db: &Db,
    request_body: Interaction,
) -> Result<Option<InteractionResponse>, HandlerError> {
    let response = handle_request(db, request_body)
        .await
        .context("Failed handling Discord request")?;

    return Ok(response);
}
