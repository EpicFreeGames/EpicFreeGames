import { drizzle } from "drizzle-orm/planetscale-serverless";

import { connect } from "@planetscale/database";

const conn = connect({
	host: process.env["DB_HOST"],
	username: process.env["DB_USER"],
	password: process.env["DB_PASS"],
});

export const db = drizzle(conn);
