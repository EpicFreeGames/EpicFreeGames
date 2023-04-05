use std::{net::SocketAddr, time::Duration};

use axum::{body::Body, middleware, response::Response, routing::post, Router};
use config::CONFIG;
use data::types::Data;
use hyper::Request;
use tower_http::trace::TraceLayer;
use tracing::{info_span, Span};
use tracing_subscriber::{
    filter, prelude::__tracing_subscriber_SubscriberExt, util::SubscriberInitExt,
};
use types::RequestContextStruct;
use ulid::Ulid;

mod endpoints;
pub mod types;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(filter::LevelFilter::INFO)
        .with(tracing_subscriber::fmt::layer())
        .init();

    let data = Data::new().await;

    let v1_routes = Router::new()
        .route("/discord", post(endpoints::discord::discord_endpoint))
        .layer(middleware::from_fn(endpoints::discord::discord_middleware));

    let api_routes = Router::new().nest("/v1", v1_routes);

    let app = Router::new()
        .nest("/api", api_routes)
        .with_state(RequestContextStruct::new(data))
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
                    tracing::debug!(
                        "response latency: {:?}, status: {:?}",
                        latency,
                        response.status()
                    );
                }),
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));

    tracing::info!("App started in {}, listening at {}", CONFIG.env, addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
