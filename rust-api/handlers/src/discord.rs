use anyhow::Context;
use data::games::games_cache::ApiGamesCache;
use database::types::Db;
use discord::{
    http_handlers::handle_request,
    types::interaction::{Interaction, InteractionResponse},
};

use crate::types::HandlerError;

pub async fn discord_request_handler(
    db: &Db,
    api_games_cache: &ApiGamesCache,
    request_body: Interaction,
) -> Result<Option<InteractionResponse>, HandlerError> {
    let response = handle_request(db, api_games_cache, request_body)
        .await
        .context("Failed handling Discord request")?;

    return Ok(response);
}
