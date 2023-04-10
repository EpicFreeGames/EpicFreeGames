use i18n::{translator::Translator, types::Language};
use twilight_model::http::interaction::{
    InteractionResponse, InteractionResponseData, InteractionResponseType,
};

use crate::{embeds, types::exports::Interaction};

pub async fn help_command(
    translator: &Translator,
    _i: &Interaction,
    language: &Language,
) -> Result<InteractionResponse, anyhow::Error> {
    let response: InteractionResponse = InteractionResponse {
        data: Some(InteractionResponseData {
            embeds: Some(vec![embeds::help_embed::help_embed(translator, language)]),
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
