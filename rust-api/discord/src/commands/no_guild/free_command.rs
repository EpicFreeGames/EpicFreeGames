use database::Db;
use twilight_model::{
    channel::message::Embed,
    http::interaction::{InteractionResponse, InteractionResponseData, InteractionResponseType},
};

use crate::types::{
    bot::{Currency, Language},
    interaction::Interaction,
};

pub async fn free_command(
    db: &Db,
    _i: &Interaction,
    language: &Language,
    currency: &Currency,
) -> Result<InteractionResponse, anyhow::Error> {
    let games = db.games.get_free().await?;

    tracing::info!("games: {:?}", games);

    let game_embeds: Vec<Embed> = games
        .iter()
        .map(|game| crate::embeds::game_embed::game_embed(game, language, currency))
        .collect();

    tracing::debug!("game_embeds: {:?}", game_embeds);

    let response: InteractionResponse = InteractionResponse {
        data: Some(InteractionResponseData {
            content: None,
            flags: None,
            choices: None,
            custom_id: None,
            embeds: Some(game_embeds),
            title: None,
            ..Default::default()
        }),
        kind: InteractionResponseType::ChannelMessageWithSource,
    };

    tracing::debug!("response: {:?}", response);

    return Ok(response);
}
