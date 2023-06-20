// "$std/": "https://deno.land/std@0.191.0/",
// "cliffy/": "https://deno.land/x/cliffy@v0.25.7/",
// "postgresjs": "https://deno.land/x/postgresjs@v3.0.6/mod.js"
export { Command, HelpCommand, CompletionsCommand } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
export {
    GithubProvider,
    UpgradeCommand as CliffyUpgradeCommand,
} from "https://deno.land/x/cliffy@v0.25.7/command/upgrade/mod.ts";

export { default as postgresjs } from "https://deno.land/x/postgresjs@v3.3.5";
export { join } from "https://deno.land/std@0.192.0/path/mod.ts";