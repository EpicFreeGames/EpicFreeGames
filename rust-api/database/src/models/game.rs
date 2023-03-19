#[derive(Debug, Clone, sqlx::FromRow, serde::Serialize, serde::Deserialize)]
pub struct DbGame {
    pub id: String,
    pub name: String,
    pub display_name: String,
    pub image_url: String,
    pub start_date: chrono::DateTime<chrono::Utc>,
    pub end_date: chrono::DateTime<chrono::Utc>,
    pub confirmed: bool,
    pub path: String,
    pub store_id: String,
    pub sending_id: Option<String>,
}

pub struct DbCreateGameInput {
    pub name: String,
    pub display_name: String,
    pub image_url: String,
    pub start_date: chrono::DateTime<chrono::Utc>,
    pub end_date: chrono::DateTime<chrono::Utc>,
    pub path: String,
    pub store_id: String,
}
