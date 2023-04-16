use anyhow::Context;
use axum::{
    async_trait,
    extract::{rejection::TypedHeaderRejectionReason, Extension, FromRequestParts},
    headers::{authorization::Bearer, Authorization, Cookie},
    http::request::Parts,
    RequestPartsExt, TypedHeader,
};
use entity::session::Entity as SessionEntity;
use hyper::header::AUTHORIZATION;

use crate::types::{ApiError, RequestContext};
use sea_orm::EntityTrait;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Session {
    pub id: String,
    pub user_id: String,
}

#[async_trait]
impl<S> FromRequestParts<S> for Session
where
    S: Send + Sync,
{
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let cookie_header: &Option<TypedHeader<Cookie>> = &parts
            .extract()
            .await
            .map_err(|_| ApiError::UnauthorizedError("Missing cookie".to_string()))?;

        let session_id = cookie_header
            .as_ref()
            .and_then(|cookie| cookie.get("session_id"))
            .ok_or_else(|| ApiError::UnauthorizedError("Missing session_id cookie".to_string()))?;

        let Extension(request_context) = parts
            .extract::<Extension<RequestContext>>()
            .await
            .context("Failed to extract request context")?;

        let session = SessionEntity::find_by_id(session_id)
            .one(&request_context.data.db)
            .await
            .context("Failed to do SessionEntity::find_by_id")?;

        if let Some(session) = session {
            if session.expires_at > chrono::Utc::now().naive_utc() {
                // Session is found and not expired, return it

                return Ok(Session {
                    id: session.id,
                    user_id: session.user_id,
                });
            } else {
                // Session has expired, return forbidden

                return Err(ApiError::ForbiddenError);
            }
        } else {
            // Session was not found, return unauthorized

            return Err(ApiError::UnauthorizedError(
                "Session has expired".to_string(),
            ));
        }
    }
}
