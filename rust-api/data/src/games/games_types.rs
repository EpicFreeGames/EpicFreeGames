#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct GameStore {
    pub id: String,
    pub name: String,
    pub web_link_label: String,
    pub web_base_url: String,
    pub app_link_label: String,
    pub app_base_url: String,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum GameStatus {
    Free,
    Upcoming,
    Gone,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Game {
    pub id: String,
    pub name: String,
    pub display_name: String,
    pub image_url: String,
    pub start_date: chrono::DateTime<chrono::Utc>,
    pub end_date: chrono::DateTime<chrono::Utc>,
    pub confirmed: bool,
    pub path: String,
    pub sending_id: Option<String>,
    pub status: GameStatus,
    pub store: GameStore,
    pub web_link: String,
    pub app_link: String,
    pub redirect_web_link: String,
    pub redirect_app_link: String,
}
