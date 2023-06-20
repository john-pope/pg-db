import postgresjs from "postgresjs";
import { join } from "$std/path/mod.ts";

export { join };

export const CWD = join(Deno.cwd());
const databaseConnectionModule = await import (`file://${CWD}/database/connection.ts`);

function connect() {
    return databaseConnectionModule.connect();
}

export function ensureConnection(): Connection {
    try {
        return connect();
    } catch (error) {
        if(error instanceof postgresjs.PostgresError) {
            if(error.code === DatabaseErrorCodes.DatabaseDoesNotExist) {
                console.error("Database does not exist/no database specified")
            } else {
                console.error("Error running migration", error.code)
            }
        } else {
            console.error("Error running initial migration")
        }

        throw(error)
    }
}

export type Connection = postgresjs.Sql<Record<string | number | symbol, never>>;

export enum DatabaseErrorCodes {
    DatabaseDoesNotExist = '3D000',
    TableDoesNotExist = '42P01',
}