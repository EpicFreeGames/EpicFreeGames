import { InferModel } from "drizzle-orm";
import { boolean, datetime, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const game = mysqlTable("games", {
	id: varchar("id", { length: 36 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	displayName: varchar("display_name", { length: 255 }).notNull(),
	imageUrl: text("image_url").notNull(),
	startDate: datetime("start_date").notNull(),
	endDate: datetime("end_date").notNull(),
	confirmed: boolean("confirmed").notNull(),
	path: varchar("path", { length: 255 }).notNull(),
});

export type Game = InferModel<typeof game>;
