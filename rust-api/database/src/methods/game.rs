use anyhow::Context;
use futures::TryStreamExt;
use sqlx::{postgres::PgRow, Row};
use uuid::Uuid;

use crate::{
    models::{DbCreateGameInput, DbGame},
    types::DbPool,
};

#[derive(Clone)]
pub struct DbGameMethods {
    pub pool: DbPool,
}

impl DbGameMethods {
    pub async fn create(
        &self,
        create_game_input: DbCreateGameInput,
    ) -> Result<DbGame, anyhow::Error> {
        let id = Uuid::new_v4();

        let game = DbGame {
            id: id.to_string(),
            name: create_game_input.name,
            display_name: create_game_input.display_name,
            image_url: create_game_input.image_url,
            start_date: create_game_input.start_date,
            end_date: create_game_input.end_date,
            confirmed: false,
            path: create_game_input.path,
            store_id: create_game_input.store_id,
            sending_id: None,
        };

        sqlx::query_as!(
            DbGame,
            "INSERT INTO games (id, name, display_name, image_url, start_date, end_date, confirmed, path, store_id, sending_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            game.id,
            game.name,
            game.display_name,
            game.image_url,
            game.start_date,
            game.end_date,
            game.confirmed,
            game.path,
            game.store_id,
            game.sending_id
        )
        .execute(&self.pool)
        .await
        .context("Failed to create game")?;

        return Ok(game);
    }

    pub async fn get_free(&self) -> Result<Vec<DbGame>, anyhow::Error> {
        let today = chrono::Utc::now();

        let mut rows = sqlx::query(
            "SELECT 
                id, 
                name, 
                display_name, 
                image_url, 
                start_date, 
                end_date, 
                confirmed, 
                path, 
                store_id, 
                sending_id
            FROM games 
                WHERE confirmed = true 
                    AND start_date <= $1 
                    AND end_date >= $1
                ORDER BY start_date ASC",
        )
        .bind(today)
        .fetch(&self.pool);

        let mut games = Vec::new();

        while let Some(row) = rows.try_next().await? {
            games.push(DbGame {
                id: row.try_get("id").context("Failed to get id")?,
                name: row.try_get("name").context("Failed to get name")?,
                display_name: row
                    .try_get("display_name")
                    .context("Failed to get display_name")?,
                image_url: row
                    .try_get("image_url")
                    .context("Failed to get image_url")?,
                start_date: row
                    .try_get("start_date")
                    .context("Failed to get start_date")?,
                end_date: row.try_get("end_date").context("Failed to get end_date")?,
                confirmed: row
                    .try_get("confirmed")
                    .context("Failed to get confirmed")?,
                path: row.try_get("path").context("Failed to get path")?,
                store_id: row.try_get("store_id").context("Failed to get store_id")?,
                sending_id: row
                    .try_get("sending_id")
                    .context("Failed to get sending_id")?,
            })
        }

        return Ok(games);
    }
}
