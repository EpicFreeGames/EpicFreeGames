use anyhow::Context;
use data::games::games_cache::ApiGamesCache;
use database::types::Db;
use discord::{
    http_handlers::handle_request,
    types::interaction::{Interaction, InteractionResponse},
};
use i18n::translator::Translator;

use crate::types::HandlerError;

pub async fn discord_request_handler(
    db: &Db,
    api_games_cache: &ApiGamesCache,
    translator: &Translator,
    request_body: Interaction,
) -> Result<Option<InteractionResponse>, HandlerError> {
    let response = handle_request(db, api_games_cache, translator, request_body)
        .await
        .context("Failed handling Discord request")?;

    return Ok(response);
}
