import 'std/dotenv/load.ts';

export const database = {
    url: Deno.env.get("DATABASE_URL")!,
}

export default {
    database,
};
