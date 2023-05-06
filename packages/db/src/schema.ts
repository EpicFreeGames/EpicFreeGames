import { type InferModel } from "drizzle-orm";
import { boolean, doublePrecision, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
	id: varchar("id", { length: 36 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	displayName: varchar("display_name", { length: 255 }).notNull(),
	imageUrl: text("image_url").notNull(),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	confirmed: boolean("confirmed").notNull(),
	path: varchar("path", { length: 255 }).notNull(),
});

export type Game = InferModel<typeof games>;

export const gamePrices = pgTable("game_prices", {
	id: varchar("id", { length: 36 }).primaryKey(),
	gameId: varchar("game_id", { length: 36 })
		.references(() => games.id)
		.notNull(),
	value: doublePrecision("value").notNull(),
	formattedValue: varchar("formatted_value", { length: 255 }).notNull(),
	currencyCode: varchar("currency_code", { length: 10 }).notNull(),
});

export type GamePrice = InferModel<typeof gamePrices>;

export const users = pgTable("users", {
	id: varchar("id", { length: 36 }).primaryKey(),
	email: varchar("email", { length: 255 }).notNull(),
});

export type User = InferModel<typeof users>;
