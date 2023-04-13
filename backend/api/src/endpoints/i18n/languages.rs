use axum::{response::IntoResponse, Json};

use crate::types::ApiError;

pub async fn get_languages_endpoint() -> Result<impl IntoResponse, ApiError> {
    return Ok(Json(
        handlers::i18n::languages::get_languages_handler().await?,
    ));
}
