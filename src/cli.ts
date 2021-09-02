#!/usr/bin/env node

import yargs from "yargs";

export const cliscriptName = "scpcli";

yargs(process.argv.slice(2))
  .scriptName(cliscriptName)
  .usage("$0 [cmd] <args>")
  .command(
    "$0",
    "The Help",
    () => undefined,
    () => {
      yargs.showHelp();
    }
  )
  .commandDir("commands")
  .recommendCommands()
  .alias({ h: "help" })
  .strict()
  .help().argv;
