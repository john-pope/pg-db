import { Command } from "cliffy/command/mod.ts";
import { migrate } from "../migrations.ts";

export const MigrateCommand = await new Command()
  .description('Applies database migrations')
  .option(
    '-s, --step <step:number>',
    'Number of migrations to apply. Defaults to running all migrations',
  )
  .action(async ({step}) => {
    await migrate(step);
  })