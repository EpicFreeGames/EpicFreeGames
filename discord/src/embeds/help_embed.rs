use std::collections::HashMap;

use config::CONSTANTS;
use i18n::{translator::Translator, types::Language};
use twilight_model::channel::message::Embed;

use crate::types::embed::{embed_color, EmbedColor};

use super::embed_utils::bold;

pub fn help_embed(translator: &Translator, language: &Language) -> Embed {
    return Embed {
        color: Some(embed_color(EmbedColor::Gray)),
        title: Some(translator.translate("help", language, None)),
        description: Some(format!(
            "
            {help_desc}
            
            {looking_for_commands}
            
            {how_to_tutorial}
            
            {having_problems}
            
            {would_like_to_translate}
            {if_would_like_to_translate}
            ",
            help_desc = format!("👋 {}", translator.translate("help_desc", language, None)),
            looking_for_commands = format!(
                "📋 {}",
                translator.translate(
                    "looking_for_commands",
                    language,
                    Some(&HashMap::from([(
                        "commandsLink",
                        CONSTANTS.website_commands_url.as_str()
                    )]))
                )
            ),
            how_to_tutorial = format!(
                "🎮 {}",
                translator.translate(
                    "how_to_tutorial",
                    language,
                    Some(&HashMap::from([(
                        "tutorialLink",
                        CONSTANTS.website_tutorial_url.as_str()
                    )]))
                )
            ),
            having_problems = format!(
                "🤔 {}",
                translator.translate(
                    "having_problems",
                    language,
                    Some(&HashMap::from([(
                        "supportServerLink",
                        CONSTANTS.server_invite_url.as_str()
                    )]))
                )
            ),
            would_like_to_translate = format!(
                "🚩 {}",
                bold(translator.translate(
                    "would_you_like_to_translate",
                    language,
                    Some(&HashMap::from([("botName", CONSTANTS.bot_name.as_str())]))
                ))
            ),
            if_would_like_to_translate = format!(
                "- {}",
                translator.translate(
                    "if_would_like_to_translate",
                    language,
                    Some(&HashMap::from([(
                        "serverInvite",
                        CONSTANTS.server_invite_url.as_str()
                    )]))
                )
            )
        )),
        author: None,
        fields: Vec::new(),
        footer: None,
        image: None,
        kind: "rich".to_string(),
        provider: None,
        thumbnail: None,
        timestamp: None,
        url: None,
        video: None,
    };
}
