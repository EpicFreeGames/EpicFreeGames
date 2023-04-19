use axum::{extract::Extension, response::IntoResponse, Json};

use crate::{auth::types::Session, types::ApiError};

pub async fn get_session_endpoint(
    Extension(session): Extension<Session>,
) -> Result<impl IntoResponse, ApiError> {
    return Ok(Json(session));
}
