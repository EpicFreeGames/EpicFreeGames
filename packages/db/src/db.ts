import { env } from "./env";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: env.DB_URL,
});

export const db = drizzle(pool);

export type Db = NodePgDatabase;
