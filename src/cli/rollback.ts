import { Command } from "cliffy/command/mod.ts";
import { rollback } from "../migrations.ts";

export const RollbackCommand = await new Command()
  .description('Rollsback database migrations')
  .option(
    '-s, --step <step:number>',
    'Number of migration batches to rollback. Defaults to rolling back the last batch of migrations',
  )
  .action(async ({step}) => {
    await rollback(step);
  })