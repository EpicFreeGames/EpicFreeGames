//! `SeaORM` Entity. Generated by sea-orm-codegen 0.11.2

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "sending_log")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false, column_type = "Text")]
    pub id: String,
    #[sea_orm(column_type = "Text")]
    pub r#type: String,
    #[sea_orm(column_type = "Text")]
    pub result: String,
    pub success: bool,
    pub server_id: i64,
    #[sea_orm(column_type = "Text")]
    pub sending_id: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::sending::Entity",
        from = "Column::SendingId",
        to = "super::sending::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Sending,
    #[sea_orm(
        belongs_to = "super::server::Entity",
        from = "Column::ServerId",
        to = "super::server::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Server,
}

impl Related<super::sending::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Sending.def()
    }
}

impl Related<super::server::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Server.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}