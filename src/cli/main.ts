import { Command, HelpCommand, CompletionsCommand } from "cliffy/command/mod.ts";
import { MigrateCommand } from "./migrate.ts";
import { RollbackCommand } from "./rollback.ts";
import { NewCommand } from "./new.ts";
import { UpgradeCommand } from "./upgrade.ts";

const command = new Command()
  .name('gul-db')
  .version('1.0.0-alpha')
  .description('Manage database migrations for gul')
  .default("help")
  .command("help", new HelpCommand().hidden())
  .command("completions", new CompletionsCommand())
  .command('upgrade', UpgradeCommand)
  .command('migrate', MigrateCommand)
  .command('rollback', RollbackCommand)
  .command('new', NewCommand)
  
  .parse();