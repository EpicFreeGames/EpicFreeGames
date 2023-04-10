use anyhow::Context;
use config::CONFIG;
use slash_commands::get_slash_commands;
use twilight_http::Client;

mod slash_commands;

#[tokio::main]
async fn main() {
    let commands = get_slash_commands();

    println!("Setting global commands...");

    let client = Client::new(CONFIG.discord_token.to_string());

    let application_id = {
        let response = client
            .current_user_application()
            .await
            .expect("failed to get current user application");

        response
            .model()
            .await
            .expect("failed to get application id")
            .id
    };

    client
        .interaction(application_id)
        .set_global_commands(&commands)
        .await
        .expect("failed to set global commands");

    println!("Done!");
}
