use chrono::NaiveDateTime;
use entity::{game, game_price};
use i18n::types::Currency;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ApiGameStore {
    pub id: String,
    pub name: String,
    pub web_link_label: String,
    pub web_base_url: String,
    pub app_link_label: String,
    pub app_base_url: String,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ApiGameStatus {
    Free,
    Upcoming,
    Gone,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ApiGamePrice {
    id: String,
    value: f64,
    formatted_value: String,
    currency_code: String,
    game_id: String,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ApiGame {
    pub id: String,
    pub name: String,
    pub display_name: String,
    pub image_url: String,
    pub start_date: NaiveDateTime,
    pub end_date: NaiveDateTime,
    pub confirmed: bool,
    pub path: String,
    pub sending_id: Option<String>,
    pub status: ApiGameStatus,
    pub store: ApiGameStore,
    pub web_link: String,
    pub app_link: String,
    pub redirect_web_link: String,
    pub redirect_app_link: String,
    pub prices: Vec<ApiGamePrice>,
}

const STORE_BASE_URL: &str = "https://www.epicgames.com/store/p";
const APP_BASE_URL: &str = "com.epicgames.launcher://store/p";
const R_STORE_BASE_URL: &str = "https://epicfreegames.net/r/s";
const R_APP_BASE_URL: &str = "https://epicfreegames.net/r/a";

impl ApiGame {
    pub fn from_db(db_game: &game::Model, db_game_prices: &Vec<game_price::Model>) -> Self {
        let prices = db_game_prices
            .into_iter()
            .map(|db_game_price| ApiGamePrice {
                id: db_game_price.id.to_string(),
                value: db_game_price.value,
                formatted_value: db_game_price.formatted_value.to_string(),
                currency_code: db_game_price.currency_code.to_string(),
                game_id: db_game_price.game_id.to_string(),
            })
            .collect();

        let store = ApiGameStore {
            app_base_url: APP_BASE_URL.to_string(),
            app_link_label: "Epic Launcher".to_string(),
            id: "epic".to_string(),
            name: "Epic Games Store".to_string(),
            web_base_url: STORE_BASE_URL.to_string(),
            web_link_label: "Epic Games Store".to_string(),
        };

        let status = if db_game.start_date > chrono::Utc::now().naive_utc() {
            ApiGameStatus::Upcoming
        } else if db_game.end_date < chrono::Utc::now().naive_utc() {
            ApiGameStatus::Gone
        } else {
            ApiGameStatus::Free
        };

        let web_link = format!("{}/{}", store.web_base_url, db_game.path);
        let app_link = format!("{}/{}", store.app_base_url, db_game.path);
        let redirect_web_link = format!("{}/{}", R_STORE_BASE_URL, db_game.path);
        let redirect_app_link = format!("{}/{}", R_APP_BASE_URL, db_game.path);

        return Self {
            id: db_game.id.to_string(),
            name: db_game.name.to_string(),
            display_name: db_game.display_name.to_string(),
            image_url: db_game.image_url.to_string(),
            start_date: db_game.start_date,
            end_date: db_game.end_date,
            confirmed: db_game.confirmed,
            path: db_game.path.to_string(),
            sending_id: db_game.sending_id.clone(),
            status,
            store,
            web_link,
            app_link,
            redirect_web_link,
            redirect_app_link,
            prices,
        };
    }

    pub fn get_formatted_price(&self, currency_code: &str) -> String {
        let price_in_currency = self
            .prices
            .iter()
            .find(|price| price.currency_code == currency_code);

        match price_in_currency {
            Some(price) => price.formatted_value.to_string(),
            None => {
                let price_default_currency = self
                    .prices
                    .iter()
                    .find(|price| price.currency_code == Currency::default().code);

                match price_default_currency {
                    Some(price) => price.formatted_value.to_string(),
                    None => "???".to_string(),
                }
            }
        }
    }
}
