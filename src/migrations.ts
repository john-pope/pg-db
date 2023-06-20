import { ensureConnection, Connection, CWD, DatabaseErrorCodes } from "./mod.ts";
import { join, postgresjs } from "./deps.ts";

type Migration = {
    name: string;
    batch: number;
    ranAt: Date;
}

export async function ensureMigrationsTable(sql: Connection, createIfNotExists=true) {
    try{
        await sql`SELECT * FROM migrations limit 1`;
    } catch (error) {
        if(error instanceof postgresjs.PostgresError) {
            if(error.code === DatabaseErrorCodes.TableDoesNotExist) {
                if(createIfNotExists) {
                    const initMigration = '0000_init.ts'
                    await up(sql, initMigration, 0);
                } else {
                    return false;
                }
            } else {
                throw error
            }
        } else {
            console.error("Error running initial migration")
        }
    }

    return true;
}

export async function up(sql: Connection, migration: string, batch: number) {
    // run migration
    const migrationPath = join(CWD, "database", "migrations", migration);
    const migrationModule = await import(`file://${migrationPath}`);
    console.log(`Running migration ${migration}...`);
    await migrationModule.up(sql);
    // update migrations table
    await sql`INSERT INTO migrations (name, batch) VALUES (${migration}, ${batch})`;
}

export async function down(sql: Connection, migration: string) {
    // run migration
    const migrationPath = join(CWD, "database", "migrations", migration);
    const migrationModule = await import(`file://${migrationPath}`);
    console.log(`Rolling back migration ${migration}...`);
    await migrationModule.down(sql);

    if(migration !== '0000_init.ts') {
        // update migrations table
        await sql`DELETE FROM migrations WHERE name = ${migration}`;
    }
}

export async function rollback(step=1) {
    // get latest migration from database
    const sql = ensureConnection();

    const migrationsTableExists = await ensureMigrationsTable(sql, false);
    if(!migrationsTableExists) {
        console.log('No migrations to rollback')
        await sql.end();
        return;
    }

    const latestMigration = (await sql<Migration[]>`SELECT * FROM migrations ORDER BY name DESC LIMIT 1`)?.[0];
    
    const batch = latestMigration.batch - step;

    const migrationsToRollback = await sql<Migration[]>`
        SELECT * FROM migrations
        WHERE name != '0000_init.ts'
        ${ step ? sql`AND batch > ${batch}` : sql`` }
        ORDER BY batch DESC, name DESC
    `;

    // run the `down` function contained in each file that needs to be rolled back
    for await (const migration of migrationsToRollback) {
        await down(sql, migration.name)
    }

    // check if any migrations remain
    const remainingMigrations = await sql<[]>`
        SELECT count(batch)
        FROM migrations
        WHERE batch != 0
        GROUP BY batch
        ORDER BY batch DESC`;
    if(remainingMigrations.length) {
        console.log(`${remainingMigrations.length} migration batches remain`)
    } else {
        await down(sql, '0000_init.ts');
    }

    sql.end();
    console.log('finished rollback')
}

export async function migrate(step?: number) {
    // get latest migration from database
    const sql = ensureConnection();

    // see if migrations folder exists
    try {
        Deno.statSync("./database/migrations").isDirectory;
    } catch {
        Deno.mkdirSync("./database/migrations", { recursive: true });
        Deno.writeTextFileSync("./database/migrations/0000_init.ts", `import { Connection } from "pg-db";

export async function up(sql: Connection) {
    await sql\`CREATE TABLE migrations (
        name TEXT PRIMARY KEY,
        batch INTEGER NOT NULL,
        ran_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )\`;
}

export async function down(sql: Connection) {
    await sql\`DROP TABLE IF EXISTS migrations\`;
    await sql\`DROP EXTENSION IF EXISTS "citext"\`
}`
        );
    }

    await ensureMigrationsTable(sql);
    const allMigrations = await sql<Migration[]>`SELECT * FROM migrations ORDER BY name DESC`;
    const latestMigration = allMigrations[0];

    // look in ./database/migrations
    const migrations = [...Deno.readDirSync(`${CWD}/database/migrations`)];

    // find all migrations that are newer than latest migration or not in allMigrations
    const newMigrations = migrations.filter((migration) => {
        return migration.name > latestMigration.name || !allMigrations.find((m) => m.name === migration.name);
    });

    // sort the new migrations by name
    newMigrations.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
    });

    // if step is specified, only run that many migrations
    if(step) {
        newMigrations.splice(step);
    }

    // run the `up` function contained in each file that needs to be ran
    for await (const migration of newMigrations) {
        await up(sql, migration.name, latestMigration.batch + 1)
    }

    sql.end();
    console.log('all migrations complete')
    
}

export async function newMigration(name: string, index?: string) {
    const template = `import { Connection } from "pg-db";

export async function up(sql: Connection) {
    // write your migration here

    // example:
    // await sql\`CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT)\`;
}

export async function down(sql: Connection) {
    // write your rollback here

    // example:
    // await sql\`DROP TABLE users\`;
}
`;

    let prefix = new Date().toISOString()
        .replaceAll(":", "")
        .replace("T", "_")
        .replace(/\.\d+Z$/, "");
    console.log(prefix, new Date().toISOString());
    if(index) {
        prefix += `.${index.padStart(2, '0')}`;
    }
    const filename = `${prefix}_${name}.ts`;
    const path = `./database/migrations/${filename}`;
    await Deno.writeTextFile(path, template);

    return filename;
}