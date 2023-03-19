#[derive(Debug, thiserror::Error)]
pub enum HandlerError {
    #[error(transparent)]
    UnexpectedError(#[from] anyhow::Error),

    #[error("{0}")]
    BadRequestError(String),
}
