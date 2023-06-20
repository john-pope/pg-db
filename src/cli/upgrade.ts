import {
  Command,
  GithubProvider,
  CliffyUpgradeCommand,
} from "../deps.ts";

export const UpgradeCommand = new Command()
  .command(
    "upgrade",
    new CliffyUpgradeCommand({
        main: "./main.ts",
        args: [
            "--config=./deno.jsonc",
            "--allow-env=GITHUB_TOKEN",
            "--allow-net",
            "--allow-read=./database",
            "--allow-write=./database",
        ],

        provider: [
            new GithubProvider({
                repository: "john-pope/pg-db",
                token: Deno.env.get("GITHUB_TOKEN"),
            })],
      }),
    )
  ;