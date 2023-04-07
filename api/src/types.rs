use std::time::Duration;

use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};
use config::CONFIG;
use data::types::Data;
use discord::types::exports::HttpClient;
use handlers::types::HandlerError;
use hyper::StatusCode;
use i18n::translator::Translator;
use serde_json::json;

#[derive(Clone)]
pub struct RequestContextStruct {
    pub data: Data,
    pub http_client: std::sync::Arc<HttpClient>,
    pub translator: Translator,
}

impl RequestContextStruct {
    pub fn new(data: Data) -> Self {
        let http_client = HttpClient::builder()
            .token(CONFIG.discord_token.to_string())
            .build();

        Self {
            data,
            http_client: std::sync::Arc::new(http_client),
            translator: Translator::new(),
        }
    }
}

pub type RequestContext = State<RequestContextStruct>;

#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error(transparent)]
    UnexpectedError(#[from] anyhow::Error),

    #[error("{0}")]
    BadRequestError(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status_code, error_message) = match self {
            ApiError::UnexpectedError(err) => {
                tracing::error!("Unexpected error: {:#?}", err);

                (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
            }
            ApiError::BadRequestError(err) => {
                tracing::error!("Validation error: {:#?}", err);

                (StatusCode::BAD_REQUEST, err.to_string())
            }
        };

        let body = Json(json!({
            "error": error_message,
        }));

        return (status_code, body).into_response();
    }
}

impl From<HandlerError> for ApiError {
    fn from(err: HandlerError) -> Self {
        match err {
            HandlerError::UnexpectedError(err) => ApiError::UnexpectedError(err),
            HandlerError::BadRequestError(err) => ApiError::BadRequestError(err),
        }
    }
}
