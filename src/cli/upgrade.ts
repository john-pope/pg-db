import { Command } from "cliffy/command/mod.ts";
import {
  GithubProvider,
  UpgradeCommand as CliffyUpgradeCommand,
} from "cliffy/command/upgrade/mod.ts";

export const UpgradeCommand = new Command()
  .command(
    "upgrade",
    new CliffyUpgradeCommand({
        main: "cli/main.ts",
        args: [
            "--import-map=./import_map.json",
            "--allow-env=GITHUB_TOKEN",
            "--allow-read=./",
            "--allow-write=./",
            "--name=gul"
        ],

        provider: [
            new GithubProvider({
                repository: "utahstate/gul-fresh",
                token: Deno.env.get("GITHUB_TOKEN"),
            })],
      }),
    )
  ;