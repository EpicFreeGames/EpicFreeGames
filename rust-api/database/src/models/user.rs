#[derive(Clone, sqlx::FromRow, serde::Serialize, serde::Deserialize)]
pub struct DbUser {
    pub id: String,
    pub identifier: String,
    pub username: Option<String>,
    pub flags: i64,
    pub token_version: String,
}
