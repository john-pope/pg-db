import {
  GithubProvider,
  CliffyUpgradeCommand,
} from "../deps.ts";

export const UpgradeCommand = new CliffyUpgradeCommand({
  main: "./src/cli/main.ts",
  args: [
      "--config", "./deno.jsonc",
      "--allow-env",
      "--allow-net", "api.github.com,deno.land",
      "--allow-read",
      "--allow-run", "deno",
      "--allow-write", "./database",
  ],

  provider: [
      new GithubProvider({
          repository: "john-pope/pg-db",
          token: Deno.env.get("GITHUB_TOKEN"),
      })],
});