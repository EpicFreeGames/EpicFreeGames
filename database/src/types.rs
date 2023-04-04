pub type DbPool = sea_orm::DatabaseConnection;
pub type Db = DbPool;

#[derive(Debug, thiserror::Error)]
pub enum DbError {
    #[error(transparent)]
    UnexpectedError(#[from] anyhow::Error),
}
