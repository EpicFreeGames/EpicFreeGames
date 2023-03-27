use std::{collections::HashMap, fs};

use crate::types::bot::Language;

#[derive(Debug, Clone)]
pub struct Translator {
    pub translations: HashMap<String, HashMap<String, String>>,
}

impl Translator {
    pub fn new() -> Self {
        tracing::info!("Initializing translations...");

        let mut languages_and_translations: HashMap<String, HashMap<String, String>> =
            HashMap::new();

        let translations_dir = fs::read_dir("./discord/t10s").unwrap();

        for translation_dir in translations_dir {
            let translation_dir = translation_dir.unwrap();
            let language_code = translation_dir.file_name().into_string().unwrap();

            let translation_files = fs::read_dir(translation_dir.path()).unwrap();

            let mut translations: HashMap<String, String> = HashMap::new();

            for translation_file in translation_files {
                let translation_file = translation_file.unwrap();
                let translation_file_name = translation_file.file_name().into_string().unwrap();

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

    pub fn translate(&self, key: &str, language: Language) -> String {
        return self
            .translations
            .get(&language.code.to_string())
            .unwrap()
            .get(key)
            .unwrap()
            .to_string();
    }
}
