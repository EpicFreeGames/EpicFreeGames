use anyhow::Context;

use crate::languages::{DEFAULT_LANGUAGE, LANGUAGES};

#[derive(Debug, Clone)]
pub struct Language {
    pub name: String,
    pub name_english: String,
    pub code: String,
    pub website_ready: bool,
}

impl Default for Language {
    fn default() -> Self {
        return DEFAULT_LANGUAGE.clone();
    }
}

impl Language {
    pub fn from_code(code: &str) -> Result<Self, anyhow::Error> {
        let language = LANGUAGES
            .get(code)
            .context(format!("Language with code {} not found", code))?;

        return Ok(language.clone());
    }
}

#[derive(Debug)]
pub struct Currency {
    pub name: String,
    pub code: String,
    pub api_code: String,
    pub after_price: String,
    pub in_front_of_price: String,
}
