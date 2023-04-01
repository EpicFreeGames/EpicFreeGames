use anyhow::Context;

#[derive(Clone, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Env {
    Development,
    Staging,
}

impl std::fmt::Display for Env {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Env::Development => write!(f, "development"),
            Env::Staging => write!(f, "staging"),
        }
    }
}

#[derive(Clone, serde::Deserialize)]
pub struct Config {
    pub env: Env,
    pub database_url: String,
    pub jwt_secret: String,
    pub discord_public_key: String,
}

impl Config {
    pub fn new() -> Result<Self, anyhow::Error> {
        #[cfg(debug_assertions)]
        {
            use dotenv::dotenv;
            dotenv().ok();
        }

        let config = envy::from_env::<Self>().context("Invalid environment variables")?;

        return Ok(config);
    }
}

pub static CONFIG: once_cell::sync::Lazy<Config> =
    once_cell::sync::Lazy::new(|| Config::new().expect("Failed to load app config"));
