use entity::server;
use twilight_model::{channel::message::Embed, id::Id};

use crate::types::exports::HttpClient;

pub async fn send(
    http_client: &HttpClient,
    game_embeds: &Vec<Embed>,
    servers: &Vec<server::Model>,
) -> Result<(), anyhow::Error> {
    tracing::info!("starting sending, servers: {:?}", servers);

    for server in servers {
        if let Some(webhook_id) = &server.webhook_id {
            if let Some(webhook_token) = &server.webhook_token {
                let webhook =
                    http_client.execute_webhook(Id::new(*webhook_id as u64), &webhook_token);

                tracing::info!("sending webhook");

                webhook
                    .content("test")
                    .unwrap()
                    .wait()
                    .await
                    .expect("failed to send webhook");

                tracing::info!("sent webhook");
            }
        }
    }

    tracing::info!("finished sending");

    return Ok(());
}
