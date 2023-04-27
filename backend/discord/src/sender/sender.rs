use data::types::Db;
use entity::server;
use sea_orm::{ActiveModelTrait, ActiveValue, IntoActiveModel};
use twilight_model::id::Id;

use crate::types::exports::HttpClient;

pub async fn send(
    db: &Db,
    http_client: &HttpClient,
    servers: &Vec<server::Model>,
) -> Result<(), anyhow::Error> {
    tracing::info!("starting sending, servers: {:?}", servers);

    let sending_futures = servers.iter().map(|server| async move {
        if let Some(webhook_id) = &server.webhook_id {
            if let Some(webhook_token) = &server.webhook_token {
                let webhook =
                    http_client.execute_webhook(Id::new(*webhook_id as u64), &webhook_token);

                tracing::info!("sending webhook {}", server.id);

                let res = webhook.content("test").unwrap().wait().await;

                match res {
                    Ok(res) => {
                        tracing::info!("sent webhook {}", server.id);
                    }
                    Err(err) => {
                        tracing::info!(
                            "failed to send webhook to {}, setting stuff to null - err: {}",
                            server.id,
                            err.to_string()
                        );

                        let mut mutable_server = server.clone().into_active_model();

                        mutable_server.channel_id = ActiveValue::Set(None);
                        mutable_server.webhook_id = ActiveValue::Set(None);
                        mutable_server.webhook_token = ActiveValue::Set(None);

                        mutable_server.update(db).await.unwrap();
                    }
                }
            }
        }
    });

    futures::future::join_all(sending_futures).await;

    tracing::info!("finished sending");

    return Ok(());
}
