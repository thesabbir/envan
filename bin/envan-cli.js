#!/usr/bin/env node
const { Command } = require("commander");
const { main, clean } = require("../lib/main");
const program = new Command();

program
  .name("envan")
  .description("Sync .env files from AWS SSM Parameter Store")
  .version("1.0.0", "-v, --version", "output the current version");

program
  .command("pull")
  .description("envan helps you sync env files from AWS SSM")
  .option("-e, --env <env>", "environment", "dev")
  .option("-eg, --example", "generate example env files", false)
  .option("-w, --workspace", "pnpm workspace mode", false)
  .option("-f, --force", "force overwrite", false)
  .option("-p, --profile <profile>", "aws profile", "default")
  .action((args) => {
    main(args)
      .then(() => {
        console.log("Done");
      })
      .catch((err) => {
        console.error(err);
      });
  });

program
  .command("clean")
  .description("clean .env files")
  .option("-w, --workspace", "pnpm workspace mode", false)
  .option("-eg, --example", "clean example env files", false)
  .action((options) => {
    console.log("cleaning env files");
    clean(options)
      .then(() => {
        console.log("Done");
      })
      .catch((err) => {
        console.error(err);
      });
  });
program.addHelpText(
  "after",
  `

Examples:
--------
Pull dev .env files from Parameter Store:
  $ envan pull
Pull prod params with AWS profile:
  $ envan pull -e prod -p my-profile
Pull with AWS profile and force overwrite:
  $ envan pull -e dev -p my-profile -f
Pull with specified aws profile and force overwrite in workspace mode:
  $ envan pull -e dev -p my-profile -f -w
Pull .env and generate .env.example in workspace mode:
  $ envan pull -e dev -w -eg
Clean .env files:
  $ envan clean
Clean .env and  .env.example files:
  $ envan clean -eg
Clean .env and  .env.example files in workspace:
  $ envan clean -w -eg
`
);
program.parse();
