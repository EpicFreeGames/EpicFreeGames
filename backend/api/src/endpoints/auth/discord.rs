use std::collections::HashMap;

use anyhow::Context;
use axum::{
    extract::{Query, State},
    response::{IntoResponse, Redirect},
};
use config::CONFIG;
use entity::{api_user::Entity as ApiUserEntity, session};
use hyper::{
    header::{LOCATION, SET_COOKIE},
    HeaderMap, StatusCode,
};
use sea_orm::{ActiveModelTrait, ActiveValue, EntityTrait};
use ulid::Ulid;

use crate::{
    auth::session_token::create_session_token,
    types::{ApiError, RequestContext},
};

pub async fn init() -> impl IntoResponse {
    let auth_url = format!(
        "https://discord.com/api/oauth2/authorize?client_id={}&redirect_uri={}&response_type=code&scope=identify",
        CONFIG.discord_client_id,
        CONFIG.discord_redirect_url
    );

    return Redirect::to(auth_url.as_str());
}

#[derive(serde::Deserialize)]
struct AccessTokenResponseBody {
    pub access_token: String,
    pub token_type: String,
    pub expires_in: i32,
    pub refresh_token: String,
    pub scope: String,
}

#[derive(serde::Deserialize)]
struct OAuthAtMeResponseBodyUser {
    pub id: String,
    pub username: String,
    pub avatar: String,
    pub discriminator: String,
    pub public_flags: i32,
}

#[derive(serde::Deserialize)]
struct OAuthAtMeResponseBody {
    pub user: OAuthAtMeResponseBodyUser,
}

pub async fn callback(
    State(state): RequestContext,
    Query(query): Query<HashMap<String, String>>,
) -> Result<impl IntoResponse, ApiError> {
    let client = reqwest::Client::new();

    let code = query
        .get("code")
        .context("Failed to get code from query")?
        .to_string();

    let access_token_response = client
        .post("https://discord.com/api/oauth2/token")
        .form(&[
            ("client_id", CONFIG.discord_client_id.to_string()),
            ("client_secret", CONFIG.discord_client_secret.to_string()),
            ("grant_type", "authorization_code".to_string()),
            ("code", code),
            ("redirect_uri", CONFIG.discord_redirect_url.to_string()),
        ])
        .send()
        .await
        .context("Failed to send access token request")?;

    if access_token_response.status() != StatusCode::OK {
        let status = access_token_response.status();
        let access_token_response_body = access_token_response
            .text()
            .await
            .context("Failed to get access token response body")?;

        return Err(ApiError::UnexpectedError(anyhow::Error::msg(format!(
            "
            Failed to get access token - status: {}
            Body: {:#?}
            ",
            status, access_token_response_body
        ))));
    }

    let access_token_response_body = access_token_response
        .json::<AccessTokenResponseBody>()
        .await
        .context("Failed to parse access token response body")?;

    let oauth_me_response = client
        .get("https://discord.com/api/oauth2/@me")
        .bearer_auth(access_token_response_body.access_token.to_string())
        .send()
        .await
        .context("Failed to send user request")?;

    let oauth_me_response_body = oauth_me_response
        .json::<OAuthAtMeResponseBody>()
        .await
        .context("Failed to parse user response body")?;

    let db_user = ApiUserEntity::find_by_id(oauth_me_response_body.user.id.to_string())
        .one(&state.data.db)
        .await
        .context("Failed to find user")?;

    if let Some(db_user) = db_user {
        let db_new_session_id = Ulid::new().to_string();
        let db_new_session_expires_at =
            (chrono::Utc::now() + chrono::Duration::days(30)).naive_utc();

        let db_new_session = session::ActiveModel {
            id: ActiveValue::Set(db_new_session_id.to_string()),
            user_id: ActiveValue::Set(db_user.id.to_string()),
            expires_at: ActiveValue::Set(db_new_session_expires_at),
            created_at: ActiveValue::Set(chrono::Utc::now().naive_utc()),
            ip: ActiveValue::Set("".to_string()),
            user_agent: ActiveValue::Set("".to_string()),
        };

        db_new_session
            .insert(&state.data.db)
            .await
            .context("Failed to insert new session")?;

        let headers: HeaderMap = HeaderMap::from_iter(vec![
            (
                SET_COOKIE,
                format!(
                    "session={}; Path=/; Expires={}; HttpOnly",
                    create_session_token(&db_user.id, &db_new_session_id),
                    db_new_session_expires_at.format("%a, %d %b %Y %T GMT")
                )
                .parse()
                .context("Failed to create cookie header")?,
            ),
            (
                LOCATION,
                CONFIG
                    .i_dashboard_base_url
                    .parse()
                    .context("Failed to create location header")?,
            ),
        ]);

        return Ok((StatusCode::SEE_OTHER, headers));
    }

    let headers: HeaderMap = HeaderMap::from_iter(vec![(
        LOCATION,
        format!("{}/login?error=user_not_found", CONFIG.i_dashboard_base_url)
            .parse()
            .context("Failed to create location header")?,
    )]);

    return Ok((StatusCode::SEE_OTHER, headers));
}
