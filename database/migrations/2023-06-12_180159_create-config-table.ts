import { Connection } from "pg-db";

export async function up(sql: Connection) {
    await sql`CREATE EXTENSION IF NOT EXISTS "citext"`
    
    try {
        await sql`CREATE TYPE value_type AS ENUM('string', 'number', 'boolean', 'json')`
    } catch (error) {
        console.log(error)
    }

    return sql`CREATE TABLE config (
        id TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        type value_type NOT NULL DEFAULT 'string'
    )`;
}

export async function down(sql: Connection) {
    await sql`DROP TABLE config`;
    return sql`DROP TYPE value_type`;
}