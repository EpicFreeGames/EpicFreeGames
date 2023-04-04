use data::games::games_cache::ApiGamesCache;
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use twilight_model::{
    channel::message::Embed,
    http::interaction::{InteractionResponse, InteractionResponseData, InteractionResponseType},
};

use crate::{embeds, types::interaction::Interaction};

pub async fn up_command(
    translator: &Translator,
    api_games_cache: &ApiGamesCache,
    _i: &Interaction,
    language: &Language,
    currency: &Currency,
) -> Result<InteractionResponse, anyhow::Error> {
    let games = &api_games_cache.upcoming_free_games;

    let game_embeds: Vec<Embed> = games
        .iter()
        .map(|game| embeds::game_embed::game_embed(game, language, currency))
        .collect();

    let embeds = if game_embeds.is_empty() {
        vec![embeds::game_embed::no_upcoming_free_games_embed(
            language, translator,
        )]
    } else {
        game_embeds
    };

    let response: InteractionResponse = InteractionResponse {
        data: Some(InteractionResponseData {
            content: None,
            flags: None,
            choices: None,
            custom_id: None,
            embeds: Some(embeds),
            title: None,
            ..Default::default()
        }),
        kind: InteractionResponseType::ChannelMessageWithSource,
    };

    return Ok(response);
}
