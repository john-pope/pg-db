import '$std/dotenv/load.ts';

export const database = {
    url: Deno.env.get("GUL_DATABASE_URL")!,
}

export default {
    database,
};
