use crate::{games::games_cache::ApiGamesCache, get_db};

pub type DbPool = sea_orm::DatabaseConnection;
pub type Db = DbPool;

#[derive(Debug, thiserror::Error)]
pub enum DbError {
    #[error(transparent)]
    UnexpectedError(#[from] anyhow::Error),
}

#[derive(Clone)]
pub struct Data {
    pub db: Db,
    pub api_games_cache: ApiGamesCache,
}

impl Data {
    pub async fn new() -> Self {
        let db = get_db().await;

        Self {
            db: db.clone(),
            api_games_cache: ApiGamesCache::new(db.clone())
                .await
                .expect("Failed to create games cache"),
        }
    }
}
