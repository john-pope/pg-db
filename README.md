# Deno PG migrations

Simple migrations for postgres databases. This tool creates a table named `migrations` to track the state of the database.

Install CLI:

```bash
deno install --name=YOUR_PROJECT-db -f --allow-net --allow-env --allow-read=./ --allow-write=./database/migrations https://raw.githubusercontent.com/john-pope/pg-db/1.0.0-alpha/src/cli/main.ts
```

Add to imports: 

```jsonc
{
    //...
    "pg-db": "https://raw.githubusercontent.com/john-pope/pg-db/1.0.0-alpha/src/cli/main.ts"
}
```

## Usage

We'll assume you installed with `--name=test-db`

```bash
test-db --help
test-db migrate
test-db rollback
test-db new create_table_users
```

Migrations are placed in the current working directory `database/migrations`

You need to supply a connection function in `database/connection.ts`:

Here is an example `database/connection.ts` file:

```ts
import postgresjs from "postgresjs";
import {database} from '../settings.ts';

export function connect() {
    return postgresjs(database.url)
}
```