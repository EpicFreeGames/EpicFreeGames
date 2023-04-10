use std::{collections::HashMap, fs};

use crate::types::Language;

#[derive(Debug, Clone)]
pub struct Translator {
    pub translations: HashMap<String, HashMap<String, String>>,
}

impl Translator {
    pub fn new() -> Self {
        let mut languages_and_translations: HashMap<String, HashMap<String, String>> =
            HashMap::new();

        let translations_dir_location = if cfg!(debug_assertions) {
            "./i18n/t10s"
        } else {
            "./t10s"
        };

        tracing::info!(
            "Initializing translations from {}...",
            translations_dir_location
        );

        let translations_dir =
            fs::read_dir(translations_dir_location).expect("Translations directory not found");

        for translation_dir in translations_dir {
            let translation_dir = translation_dir.unwrap();
            let language_code = translation_dir.file_name().into_string().unwrap();

            let translation_files = fs::read_dir(translation_dir.path()).unwrap();

            let mut translations: HashMap<String, String> = HashMap::new();

            for translation_file in translation_files {
                let translation_file = translation_file.unwrap();

                let translation_file_content = fs::read_to_string(translation_file.path()).unwrap();

                translations.extend(
                    serde_json::from_str::<HashMap<String, String>>(&translation_file_content)
                        .unwrap(),
                );
            }

            languages_and_translations.insert(language_code, translations);
        }

        tracing::info!("Translations initialized");

        return Self {
            translations: languages_and_translations,
        };
    }

    pub fn translate(
        &self,
        key: &str,
        language: &Language,
        placeholders: Option<&HashMap<&str, &str>>,
    ) -> String {
        let translation = self.get_translation(key, language);

        if let Some(translation) = translation {
            let translation = self.replace_placeholders(&translation, placeholders);

            return translation;
        } else {
            return key.to_string();
        }
    }

    fn get_translation(&self, key: &str, language: &Language) -> Option<String> {
        if let Some(translations) = self.translations.get(&language.code.to_string()) {
            // Translations are found for the language code

            if let Some(translation) = translations.get(key) {
                // Translation is found for the key, return the translation

                return Some(translation.to_string());
            } else {
                // No translation found for the key, return the key
                tracing::warn!(
                    "No translation found for the key {} in the language {}",
                    key,
                    language.code
                );

                return None;
            }
        } else {
            // No translations found for the language code,
            // try to find translation for the default language
            tracing::warn!(
                "No translations found for the language code {}, trying to find translations for the default language code",
                language.code
            );

            if let Some(translations) = self.translations.get(&Language::default().code.to_string())
            {
                // Translations are found for the default language code

                if let Some(translation) = translations.get(key) {
                    // Translation is found for the key, return the translation

                    return Some(translation.to_string());
                } else {
                    // No translation found for the key, return the key
                    tracing::warn!(
                        "No translation found for the key {} in the language {}",
                        key,
                        language.code
                    );

                    return None;
                }
            } else {
                // No translations found for the default language code, return the key
                tracing::warn!(
                    "No translations found for the default language code {}, returning the key",
                    Language::default().code
                );

                return None;
            }
        }
    }

    fn replace_placeholders(
        &self,
        translation: &str,
        placeholders: Option<&HashMap<&str, &str>>,
    ) -> String {
        if let Some(placeholders) = placeholders {
            let mut translation = translation.to_string();

            for (placeholder, value) in placeholders {
                translation = translation.replace(&format!("<{}>", placeholder), value);
            }

            return translation;
        } else {
            return translation.to_string();
        }
    }
}
