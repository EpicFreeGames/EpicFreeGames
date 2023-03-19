use config::CONFIG;
use sqlx::postgres::PgPoolOptions;
use types::DbPool;

pub mod methods;
pub mod models;
pub mod types;

#[derive(Clone)]
pub struct Db {
    pub user: methods::DbUserMethods,
    pub games: methods::DbGameMethods,
}

impl Db {
    pub fn new(pool: DbPool) -> Self {
        Self {
            user: methods::DbUserMethods { pool: pool.clone() },
            games: methods::DbGameMethods { pool: pool.clone() },
        }
    }
}

pub async fn get_db() -> Db {
    let pool = PgPoolOptions::new()
        .max_connections(20)
        .connect(&CONFIG.database_url)
        .await
        .expect("Failed to connect to database");

    return Db::new(pool);
}
