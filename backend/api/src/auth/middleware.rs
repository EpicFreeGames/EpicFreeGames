use anyhow::Context;
use axum::headers::authorization::Bearer;
use axum::headers::Authorization;
use axum::{extract::State, http::Request, middleware::Next};
use axum::{
    headers::{Cookie, HeaderMapExt},
    response::IntoResponse,
};
use entity::session;
use entity::{api_user::Entity as ApiUserEntity, session::Entity as SessionEntity};

use crate::types::{ApiError, RequestContext};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

use super::types::{ApiUser, Session};

pub async fn middleware<B>(
    State(state): RequestContext,
    mut req: Request<B>,
    next: Next<B>,
) -> Result<impl IntoResponse, ApiError> {
    let (user_id, session_id) = {
        let from_cookie = req
            .headers()
            .typed_get::<Cookie>()
            .and_then(|cookie_header| {
                cookie_header.get("session").and_then(|cookie| {
                    cookie.split_once(".").and_then(|(user_id, session_id)| {
                        Some((user_id.to_string(), session_id.to_string()))
                    })
                })
            });

        let from_bearer =
            req.headers()
                .typed_get::<Authorization<Bearer>>()
                .and_then(|auth_token| {
                    auth_token
                        .token()
                        .split_once(".")
                        .and_then(|(user_id, session_id)| {
                            Some((user_id.to_string(), session_id.to_string()))
                        })
                });

        from_cookie
            .or(from_bearer)
            .ok_or_else(|| ApiError::UnauthorizedError("No auth provided".to_string()))?
    };

    let db_session_and_db_user = SessionEntity::find()
        .find_also_related(ApiUserEntity)
        .filter(session::Column::Id.eq(session_id))
        .filter(session::Column::UserId.eq(user_id))
        .one(&state.data.db)
        .await
        .context("Failed to get session and user from the db")?;

    if let Some((db_session, db_user)) = db_session_and_db_user {
        if let Some(db_user) = db_user {
            if db_session.expires_at > chrono::Utc::now().naive_utc() {
                // Session and corresponding user found, session not expired, all good

                req.extensions_mut().insert(Session {
                    id: db_session.id,
                    user_id: db_session.user_id,
                });

                req.extensions_mut().insert(ApiUser {
                    id: db_user.id,
                    identifier: db_user.identifier,
                    username: db_user.username,
                    flags: db_user.flags,
                });

                return Ok(next.run(req).await);
            } else {
                // Session has expired, return forbidden

                return Err(ApiError::ForbiddenError);
            }
        } else {
            // Session was found, but user was not found, return unauthorized

            return Err(ApiError::UnauthorizedError("User not found".to_string()));
        }
    } else {
        // Session or user not found, return unauthorized

        return Err(ApiError::UnauthorizedError(
            "User or session not found".to_string(),
        ));
    }
}
