import { Connection } from "pg-db";

export async function up(sql: Connection) {
    await sql`CREATE TABLE migrations (
        name TEXT PRIMARY KEY,
        batch INTEGER NOT NULL,
        ran_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
}

export async function down(sql: Connection) {
    await sql`DROP TABLE IF EXISTS migrations`;
    await sql`DROP EXTENSION IF EXISTS "citext"`
}