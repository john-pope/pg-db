import { Command } from "../deps.ts";
import { newMigration } from "../migrations.ts";

export const NewCommand = await new Command()
  .description('Creates new migration file')
  .arguments("[name...]")
  .action(async (_options, ...names) => {
    for await (const [i, name] of Object.entries(names)) {
        const filePath = await newMigration(name, names.length > 1 ? i : undefined);
        console.log(`Created migration: ${filePath}`);
    }
  })