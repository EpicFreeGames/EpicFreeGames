use axum::{response::IntoResponse, Json};

use crate::{session::Session, types::ApiError};

pub async fn get_session_endpoint(session: Session) -> Result<impl IntoResponse, ApiError> {
    return Ok(Json(session));
}
