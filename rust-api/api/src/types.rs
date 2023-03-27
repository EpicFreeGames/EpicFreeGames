use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};
use data::games::games_cache::ApiGamesCache;
use database::types::Db;
use discord::translate::Translator;
use handlers::types::HandlerError;
use hyper::StatusCode;
use serde_json::json;

#[derive(Clone)]
pub struct RequestContextStruct {
    pub db: Db,
    pub api_games_cache: ApiGamesCache,
    pub translator: Translator,
}

impl RequestContextStruct {
    pub fn new(db: Db, api_games_cache: ApiGamesCache) -> Self {
        Self {
            db,
            api_games_cache,
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
