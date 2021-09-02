import chalk from "chalk";
import ora from "ora";
import { CommandBuilder } from "yargs";
import getVServers from "../api/getVServers";
import { readConfig } from "../config";
import { Handler } from "./helper/commandTypes";
import { configExistOrTellMe } from "./helper/common";

export const command = "list";
export const desc = "Get a list of all your vServers";

export const builder: CommandBuilder = (yargs) => {
  return yargs;
};

export const handler: Handler = async () => {
  if (configExistOrTellMe()) return;
  const userConfig = await readConfig();

  const fetchSpinner = ora("List servers");
  fetchSpinner.start();

  const vServers = await getVServers(userConfig.loginName, userConfig.password);

  if (vServers.status == "ok" && vServers.result) {
    fetchSpinner.succeed();
    console.log("Your vServers: \n");
    for (let i = 0; i < vServers.result.length; i++) {
      console.log(`> ${chalk.cyan(vServers.result[i])}`);
    }
  } else fetchSpinner.fail();
};
