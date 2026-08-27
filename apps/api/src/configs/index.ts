import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "../env";
import * as schema from "./schema.js";
const pgUrl = env.DATABASE_URL;
if (!pgUrl) {
  throw new Error("DB_URL is not set in environment variables");
}

const sql = neon(pgUrl!);
export const db = drizzle(sql, { schema });
