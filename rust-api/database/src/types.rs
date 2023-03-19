pub type DbPool = sqlx::PgPool;

#[derive(Debug, thiserror::Error)]
pub enum DbError {
    #[error(transparent)]
    UnexpectedError(#[from] anyhow::Error),
}
