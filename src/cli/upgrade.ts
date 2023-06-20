import {
  Command,
  GithubProvider,
  CliffyUpgradeCommand,
} from "../deps.ts";

export const UpgradeCommand = new Command()
  .command(
    "upgrade",
    new CliffyUpgradeCommand({
        main: "src/cli/main.ts",
        args: [
            "--allow-env=GITHUB_TOKEN",
            "--allow-read=./",
            "--allow-write=./",
            "--name=gul"
        ],

        provider: [
            new GithubProvider({
                repository: "john-pope/pg-db",
                token: Deno.env.get("GITHUB_TOKEN"),
            })],
      }),
    )
  ;