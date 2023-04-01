use anyhow::Context;
use axum::{
    body::Body, extract::State, http::Request, middleware::Next, response::IntoResponse, Json,
};
use discord::{http_handlers::validate_discord_request, types::interaction::Interaction};
use handlers::discord::discord_request_handler;

use crate::types::{ApiError, RequestContext};

pub async fn discord_endpoint(
    State(state): RequestContext,
    Json(json): Json<Interaction>,
) -> Result<impl IntoResponse, ApiError> {
    let response =
        discord_request_handler(&state.db, &state.api_games_cache, &state.translator, json).await?;

    if let Some(response) = response {
        return Ok(Json(response));
    } else {
        return Err(ApiError::BadRequestError("Invalid request".to_string()));
    }
}

pub async fn discord_middleware(
    req: Request<Body>,
    next: Next<Body>,
) -> Result<impl IntoResponse, ApiError> {
    let (parts, body) = req.into_parts();

    let signature = parts
        .headers
        .get("X-Signature-Ed25519")
        .context("Missing X-Signature-Ed25519 header")?
        .to_str()
        .context("X-Signature-Ed25519 header is not a string")?;

    let timestamp = parts
        .headers
        .get("X-Signature-Timestamp")
        .context("Missing X-Signature-Timestamp header")?
        .to_str()
        .context("X-Signature-Timestamp header is not a string")?;

    let body_bytes = hyper::body::to_bytes(body)
        .await
        .context("Failed to read request body")?;

    validate_discord_request(&body_bytes, signature, timestamp)
        .await
        .context("Failed verifying request")?;

    return Ok(next
        .run(Request::from_parts(parts, Body::from(body_bytes)))
        .await);
}
