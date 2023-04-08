use data::types::Data;
use i18n::{
    translator::Translator,
    types::{Currency, Language},
};
use twilight_model::{
    channel::message::Embed,
    http::interaction::{InteractionResponse, InteractionResponseData, InteractionResponseType},
};

use crate::{embeds, types::exports::Interaction};

pub async fn up_command(
    data: &Data,
    translator: &Translator,
    _i: &Interaction,
    language: &Language,
    currency: &Currency,
) -> Result<InteractionResponse, anyhow::Error> {
    let games = &data.api_games_cache.upcoming_free_games;

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
            embeds: Some(embeds),
            allowed_mentions: None,
            attachments: None,
            choices: None,
            components: None,
            content: None,
            flags: None,
            tts: None,
            custom_id: None,
            title: None,
        }),
        kind: InteractionResponseType::ChannelMessageWithSource,
    };

    return Ok(response);
}
