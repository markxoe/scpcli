import chalk from "chalk";
import { prompt } from "enquirer";
import { CommandBuilder } from "yargs";
import { configPath, writeConfig } from "../config";
import { Handler } from "./helper/commandTypes";

export const command = "login";
export const desc = "Log into your Servercontrolpanel account";

export const builder: CommandBuilder = (yargs) => {
  return yargs;
};

export const handler: Handler = async () => {
  const { loginName, password } = await prompt<{
    loginName: string;
    password: string;
  }>([
    { name: "loginName", type: "input", message: "Your login name" },
    {
      name: "password",
      type: "password",
      message: "Your Webservice Password",
    },
  ]);

  writeConfig({ loginName: loginName, password: password });

  console.log(`Saved config at ${chalk.cyan(configPath)}`);
};
