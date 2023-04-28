import { boolean, datetime, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const game = mysqlTable("games", {
	id: varchar("id", { length: 36 }).primaryKey(),
	name: varchar("name", { length: 255 }),
	displayName: varchar("display_name", { length: 255 }),
	imageUrl: text("image_url"),
	startDate: datetime("start_date"),
	endDate: datetime("end_date"),
	confirmed: boolean("confirmed"),
	path: varchar("path", { length: 255 }),
});
