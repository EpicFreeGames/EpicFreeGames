use crate::types::{ApiError, RequestContext};
use anyhow::Context;
use axum::{extract::State, response::IntoResponse, Json};
use data::games::{
    games::db_games_get_all,
    games_types::{ApiGame, ApiGameStatus},
};
use serde_json::json;

pub async fn get_games_endpoint(
    State(state): RequestContext,
) -> Result<impl IntoResponse, ApiError> {
    let db_games = db_games_get_all(&state.data.db)
        .await
        .context("Failed to get games from the db")?;

    let free_games: Vec<ApiGame> = db_games
        .iter()
        .filter(|db_game| db_game.confirmed)
        .filter(|db_game| db_game.status == ApiGameStatus::Free)
        .cloned()
        .collect();

    let up_games: Vec<ApiGame> = db_games
        .iter()
        .filter(|db_game| db_game.confirmed)
        .filter(|db_game| db_game.status == ApiGameStatus::Upcoming)
        .cloned()
        .collect();

    return Ok(Json(json!({
        "free_games": free_games,
        "upcoming_free_games": up_games,
    })));
}
