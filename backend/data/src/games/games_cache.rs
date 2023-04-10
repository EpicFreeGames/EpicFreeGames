use crate::{games::games_types::ApiGameStatus, types::Db};

use super::games_types::ApiGame;
use anyhow::Context;
use entity::{game, game::Entity as Game, game_price::Entity as GamePrice};

use sea_orm::{EntityTrait, Order, QueryOrder};

#[derive(Clone)]
pub struct ApiGamesCache {
    db: Db,
    pub free_games: Vec<ApiGame>,
    pub upcoming_free_games: Vec<ApiGame>,
}

impl ApiGamesCache {
    pub async fn new(db: Db) -> Result<Self, anyhow::Error> {
        let mut new_cache = Self {
            db,
            free_games: Vec::new(),
            upcoming_free_games: Vec::new(),
        };

        new_cache
            .refresh()
            .await
            .context("Failed to refresh games cache")?;

        return Ok(new_cache);
    }

    pub async fn refresh(&mut self) -> Result<(), anyhow::Error> {
        tracing::debug!("Refreshing games cache");

        let games = self.get_games().await.context("Failed to get new games")?;

        let confirmed_games: Vec<ApiGame> = games
            .iter()
            .filter(|api_game| api_game.confirmed)
            .cloned()
            .collect();

        tracing::info!("Confirmed games: {:?}", confirmed_games);

        self.free_games = confirmed_games
            .iter()
            .filter(|api_game| api_game.status == ApiGameStatus::Free)
            .cloned()
            .collect();

        self.upcoming_free_games = confirmed_games
            .iter()
            .filter(|api_game| api_game.status == ApiGameStatus::Upcoming)
            .cloned()
            .collect();

        return Ok(());
    }

    async fn get_games(&self) -> Result<Vec<ApiGame>, anyhow::Error> {
        let db_games_and_prices: Vec<(entity::game::Model, Vec<entity::game_price::Model>)> =
            Game::find()
                .find_with_related(GamePrice)
                .order_by(game::Column::StartDate, Order::Asc)
                .all(&self.db)
                .await
                .context("Failed to get games and game prices from the database")?;

        let api_games: Vec<ApiGame> = db_games_and_prices
            .iter()
            .map(|(db_game, db_game_prices)| ApiGame::from_db(&db_game, &db_game_prices))
            .collect();

        return Ok(api_games);
    }
}
