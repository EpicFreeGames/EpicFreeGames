use i18n::{languages::LANGUAGES, types::Language};

use crate::types::HandlerError;

pub async fn get_languages_handler() -> Result<Vec<Language>, HandlerError> {
    return Ok(Vec::from_iter(LANGUAGES.values().cloned()));
}
