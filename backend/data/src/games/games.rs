use crate::types::Db;

use super::games_types::ApiGame;
use anyhow::Context;
use entity::{game, game::Entity as GameEntity, game_price::Entity as GamePriceEntity};
use sea_orm::{EntityTrait, Order, QueryOrder};

pub async fn db_games_get_all(db: &Db) -> Result<Vec<ApiGame>, anyhow::Error> {
    let db_games_and_prices = GameEntity::find()
        .find_with_related(GamePriceEntity)
        .order_by(game::Column::StartDate, Order::Asc)
        .all(db)
        .await
        .context("Failed to get games from database")?;

    return Ok(db_games_and_prices
        .iter()
        .map(|(db_game, db_game_prices)| ApiGame::from_db(&db_game, &db_game_prices))
        .collect());
}

pub async fn db_games_delete_one(db: &Db, id: &str) -> Result<(), anyhow::Error> {
    GameEntity::delete_by_id(id)
        .exec(db)
        .await
        .context("Failed to delete game from the database")?;

    return Ok(());
}
