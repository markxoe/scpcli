import { CommandBuilder } from "yargs";
import { prompt } from "enquirer";
import ora from "ora";
import chalk from "chalk";
import { configExists, configPath, deleteConfig } from "../config";
import { Handler } from "./helper/commandTypes";

export const command = "logout";
export const desc = "Log out";

export const builder: CommandBuilder = (yargs) => {
  return yargs;
};
export const handler: Handler = async () => {
  if (configExists()) {
    const l = (
      await prompt<{ logout: boolean }>({
        type: "confirm",
        message: "Are you sure?",
        name: "logout",
      })
    ).logout;
    if (l) {
      const logoutSpinner = ora("Loggin out").start();
      deleteConfig();
      if (!configExists()) logoutSpinner.succeed("Logged out");
      else {
        logoutSpinner.fail("Error");
        console.log(
          `\n${chalk.bold("Hint:")}\n\nTry deleting ${chalk.cyan(configPath)}`
        );
      }
    } else {
      ora("Not logged out").succeed();
    }
  } else {
    console.log("You are already logged out");
  }
};
