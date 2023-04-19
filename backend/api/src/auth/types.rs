#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Session {
    pub id: String,
    pub user_id: String,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ApiUser {
    pub id: String,
    pub identifier: String,
    pub flags: i64,
    pub username: Option<String>,
}
