use std::{net::SocketAddr, time::Duration};

use axum::http::HeaderValue;
use axum::{body::Body, middleware, response::Response, routing::get, routing::post, Router};
use config::CONFIG;
use data::types::Data;
use hyper::{Method, Request};
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing::{info_span, Span};
use tracing_subscriber::{
    filter, prelude::__tracing_subscriber_SubscriberExt, util::SubscriberInitExt,
};
use types::RequestContextStruct;
use ulid::Ulid;

mod auth;
mod endpoints;
pub mod types;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(filter::LevelFilter::DEBUG)
        .with(tracing_subscriber::fmt::layer())
        .init();

    let cors = CorsLayer::new()
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::OPTIONS,
            Method::PATCH,
            Method::DELETE,
            Method::PUT,
            Method::HEAD,
        ])
        .allow_origin(
            "http://localhost:3000"
                .parse::<HeaderValue>()
                .expect("Invalid origin"),
        )
        .allow_credentials(true);

    let data = Data::new().await;
    let state = RequestContextStruct::new(data);

    let v1_auth_routes = Router::new()
        .route(
            "/session",
            get(endpoints::auth::session::get_session_endpoint),
        )
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth::middleware,
        ))
        .merge(
            Router::new()
                .route("/discord-oauth/init", get(endpoints::auth::discord::init))
                .route(
                    "/discord-oauth/callback",
                    get(endpoints::auth::discord::callback),
                ),
        );

    let v1_games_routes = Router::new()
        .route("/", get(endpoints::games::get_games_endpoint))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            auth::middleware,
        ));

    let v1_discord_routes = Router::new()
        .route("/", post(endpoints::discord::discord_endpoint))
        .route_layer(middleware::from_fn(endpoints::discord::discord_middleware));

    let v1_routes = Router::new()
        .nest("/discord", v1_discord_routes)
        .nest("/auth", v1_auth_routes)
        .nest("/games", v1_games_routes);

    let api_routes = Router::new().nest("/v1", v1_routes);

    let app = Router::new()
        .nest("/api", api_routes)
        .with_state(state)
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|request: &Request<Body>| {
                    info_span!(
                        "request",
                        id = %Ulid::new(),
                        method = %request.method(),
                        uri = %request.uri(),
                    )
                })
                .on_response(|response: &Response, latency: Duration, _span: &Span| {
                    tracing::info!(
                        "response latency: {:?}, status: {:?}",
                        latency,
                        response.status()
                    );
                })
                .on_request(|request: &Request<Body>, _span: &Span| {
                    tracing::info!("request: {:?}", request);
                }),
        )
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8000));

    tracing::info!("App started in {}, listening at {}", CONFIG.env, addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
