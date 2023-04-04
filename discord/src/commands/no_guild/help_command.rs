use i18n::{translator::Translator, types::Language};
use twilight_model::http::interaction::{
    InteractionResponse, InteractionResponseData, InteractionResponseType,
};

use crate::{embeds, types::interaction::Interaction};

pub async fn help_command(
    translator: &Translator,
    _i: &Interaction,
    language: &Language,
) -> Result<InteractionResponse, anyhow::Error> {
    let response: InteractionResponse = InteractionResponse {
        data: Some(InteractionResponseData {
            content: None,
            flags: None,
            choices: None,
            custom_id: None,
            embeds: Some(vec![embeds::help_embed::help_embed(translator, language)]),
            title: None,
            ..Default::default()
        }),
        kind: InteractionResponseType::ChannelMessageWithSource,
    };

    return Ok(response);
}
