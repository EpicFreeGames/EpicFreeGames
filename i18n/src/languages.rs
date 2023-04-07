use std::collections::HashMap;

use crate::types::Language;

type LanguageCode = &'static str;

pub static DEFAULT_LANGUAGE: once_cell::sync::Lazy<Language> = once_cell::sync::Lazy::new(|| {
    return Language {
        name: "English".to_string(),
        code: "en".to_string(),
        name_english: "English".to_string(),
        website_ready: true,
    };
});

pub static LANGUAGES: once_cell::sync::Lazy<HashMap<LanguageCode, Language>> =
    once_cell::sync::Lazy::new(|| {
        HashMap::from([
            (
                "af",
                Language {
                    name: "Afrikaans".to_string(),
                    code: "af".to_string(),
                    name_english: "Afrikaans".to_string(),
                    website_ready: true,
                },
            ),
            (
                "ar",
                Language {
                    name: "عربي".to_string(),
                    code: "ar".to_string(),
                    name_english: "Arabic".to_string(),
                    website_ready: false,
                },
            ),
            (
                "az",
                Language {
                    name: "Azərbaycanca".to_string(),
                    code: "az".to_string(),
                    name_english: "Azerbaijani".to_string(),
                    website_ready: false,
                },
            ),
            (
                "bg",
                Language {
                    name: "Български".to_string(),
                    code: "bg".to_string(),
                    name_english: "Bulgarian".to_string(),
                    website_ready: true,
                },
            ),
            (
                "cs",
                Language {
                    name: "Čeština".to_string(),
                    code: "cs".to_string(),
                    name_english: "Czech".to_string(),
                    website_ready: false,
                },
            ),
            (
                "de",
                Language {
                    name: "Deutsch".to_string(),
                    code: "de".to_string(),
                    name_english: "German".to_string(),
                    website_ready: false,
                },
            ),
            (
                "en",
                Language {
                    name: "English".to_string(),
                    code: "en".to_string(),
                    name_english: "English".to_string(),
                    website_ready: true,
                },
            ),
            (
                "es-ES",
                Language {
                    name: "Español (España)".to_string(),
                    code: "es-ES".to_string(),
                    name_english: "Spanish (Spain)".to_string(),
                    website_ready: true,
                },
            ),
            (
                "fa",
                Language {
                    name: "فارسی".to_string(),
                    code: "fa".to_string(),
                    name_english: "Persian".to_string(),
                    website_ready: false,
                },
            ),
            (
                "fr",
                Language {
                    name: "Français".to_string(),
                    code: "fr".to_string(),
                    name_english: "French".to_string(),
                    website_ready: false,
                },
            ),
            (
                "he",
                Language {
                    name: "עברית".to_string(),
                    code: "he".to_string(),
                    name_english: "Hebrew".to_string(),
                    website_ready: false,
                },
            ),
            (
                "hi",
                Language {
                    name: "हिन्दी".to_string(),
                    code: "hi".to_string(),
                    name_english: "Hindi".to_string(),
                    website_ready: false,
                },
            ),
            (
                "hu",
                Language {
                    name: "Magyar".to_string(),
                    code: "hu".to_string(),
                    name_english: "Hungarian".to_string(),
                    website_ready: false,
                },
            ),
            (
                "id",
                Language {
                    name: "Bahasa Indonesia".to_string(),
                    code: "id".to_string(),
                    name_english: "Indonesian".to_string(),
                    website_ready: false,
                },
            ),
            (
                "it",
                Language {
                    name: "Italiano".to_string(),
                    code: "it".to_string(),
                    name_english: "Italian".to_string(),
                    website_ready: false,
                },
            ),
            (
                "ja",
                Language {
                    name: "日本語".to_string(),
                    code: "ja".to_string(),
                    name_english: "Japanese".to_string(),
                    website_ready: false,
                },
            ),
            (
                "ka",
                Language {
                    name: "ქართული".to_string(),
                    code: "ka".to_string(),
                    name_english: "Georgian".to_string(),
                    website_ready: false,
                },
            ),
            (
                "ko",
                Language {
                    name: "한국어".to_string(),
                    code: "ko".to_string(),
                    name_english: "Korean".to_string(),
                    website_ready: true,
                },
            ),
            (
                "mk",
                Language {
                    name: "Македонски".to_string(),
                    code: "mk".to_string(),
                    name_english: "Macedonian".to_string(),
                    website_ready: false,
                },
            ),
            (
                "nl",
                Language {
                    name: "Nederlands".to_string(),
                    code: "nl".to_string(),
                    name_english: "Dutch".to_string(),
                    website_ready: false,
                },
            ),
            (
                "pl",
                Language {
                    name: "Polski".to_string(),
                    code: "pl".to_string(),
                    name_english: "Polish".to_string(),
                    website_ready: true,
                },
            ),
            (
                "pt-BR",
                Language {
                    name: "Português (Brasil)".to_string(),
                    code: "pt-BR".to_string(),
                    name_english: "Portuguese (Brazil)".to_string(),
                    website_ready: false,
                },
            ),
            (
                "pt-PT",
                Language {
                    name: "Português (Portugal)".to_string(),
                    code: "pt-PT".to_string(),
                    name_english: "Portuguese (Portugal)".to_string(),
                    website_ready: false,
                },
            ),
            (
                "ro",
                Language {
                    name: "Română".to_string(),
                    code: "ro".to_string(),
                    name_english: "Romanian".to_string(),
                    website_ready: false,
                },
            ),
            (
                "ru",
                Language {
                    name: "Русский".to_string(),
                    code: "ru".to_string(),
                    name_english: "Russian".to_string(),
                    website_ready: true,
                },
            ),
            (
                "sr",
                Language {
                    name: "Српски".to_string(),
                    code: "sr".to_string(),
                    name_english: "Serbian".to_string(),
                    website_ready: false,
                },
            ),
            (
                "sr-CS",
                Language {
                    name: "Srpski (Latinica)".to_string(),
                    code: "sr-CS".to_string(),
                    name_english: "Serbian (Latin)".to_string(),
                    website_ready: false,
                },
            ),
            (
                "tr",
                Language {
                    name: "Türkçe".to_string(),
                    code: "tr".to_string(),
                    name_english: "Turkish".to_string(),
                    website_ready: true,
                },
            ),
            (
                "uk",
                Language {
                    name: "Українська".to_string(),
                    code: "uk".to_string(),
                    name_english: "Ukrainian".to_string(),
                    website_ready: true,
                },
            ),
            (
                "vi",
                Language {
                    name: "Tiếng Việt".to_string(),
                    code: "vi".to_string(),
                    name_english: "Vietnamese".to_string(),
                    website_ready: true,
                },
            ),
            (
                "zh-TW",
                Language {
                    name: "繁體中文".to_string(),
                    code: "zh-TW".to_string(),
                    name_english: "Chinese (Traditional)".to_string(),
                    website_ready: true,
                },
            ),
        ])
    });
