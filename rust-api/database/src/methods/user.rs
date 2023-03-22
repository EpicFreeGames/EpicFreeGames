use anyhow::Context;
use uuid::Uuid;

use crate::{models::DbUser, types::DbPool};

#[derive(Clone)]
pub struct DbUserMethods {
    pub pool: DbPool,
}

impl DbUserMethods {
    pub async fn create(&self, identifier: &str, flags: &i64) -> Result<DbUser, anyhow::Error> {
        let id = Uuid::new_v4();

        let user = DbUser {
            id: id.to_string(),
            username: None,
            flags: *flags,
            identifier: identifier.to_string(),
            token_version: Uuid::new_v4().to_string(),
        };

        sqlx::query_as!(
            DbUser,
            "INSERT INTO api_user (id, username, flags, identifier, token_version) VALUES ($1, $2, $3, $4, $5)",
            user.id,
            user.username,
            user.flags,
            user.identifier,
            user.token_version
        )
        .execute(&self.pool)
        .await
        .context("Failed to create user")?;

        return Ok(user);
    }

    pub async fn create_with_username(
        &self,
        identifier: &str,
        flags: &i64,
        username: &str,
    ) -> Result<DbUser, anyhow::Error> {
        let id = Uuid::new_v4();

        let user = DbUser {
            username: Some(username.to_string()),
            id: id.to_string(),
            flags: *flags,
            identifier: identifier.to_string(),
            token_version: Uuid::new_v4().to_string(),
        };

        sqlx::query_as!(
            DbUser,
            "INSERT INTO api_user (id, username, flags, identifier, token_version) VALUES ($1, $2, $3, $4, $5)",
            user.id,
            user.username,
            user.flags,
            user.identifier,
            user.token_version
        )
        .execute(&self.pool)
        .await
        .context("Failed to create user")?;

        return Ok(user);
    }

    pub async fn delete(&self, id: &str) -> Result<(), anyhow::Error> {
        sqlx::query_as!(DbUser, "DELETE FROM api_user WHERE id = $1", id)
            .execute(&self.pool)
            .await
            .context("Failed to delete user")?;

        return Ok(());
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<DbUser>, anyhow::Error> {
        let user = sqlx::query_as!(DbUser, "SELECT * FROM api_user WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
            .context("Failed to get user by id")?;

        return Ok(user);
    }

    pub async fn get_all(&self) -> Result<Vec<DbUser>, anyhow::Error> {
        let users = sqlx::query_as!(DbUser, "SELECT * FROM api_user")
            .fetch_all(&self.pool)
            .await
            .context("Failed to get all users")?;

        return Ok(users);
    }

    pub async fn update(
        &self,
        id: &str,
        flags: &i64,
        token_version: &str,
    ) -> Result<(), anyhow::Error> {
        sqlx::query_as!(
            DbUser,
            "UPDATE api_user SET flags = $1, token_version = $2 
            WHERE id = $3",
            flags,
            token_version,
            id,
        )
        .execute(&self.pool)
        .await
        .context("Failed to update user")?;

        return Ok(());
    }
}
