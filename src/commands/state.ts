import { CommandBuilder } from "yargs";
import { readConfig } from "../config";
import ora from "ora";
import getVServerProcesses from "../api/getVServerProcesses";
import getVServerState from "../api/getVServerState";
import chalk from "chalk";
import {
  configExistOrTellMe,
  getServerID,
  serverIdArgument,
  serverIdOption,
} from "./helper/common";
import { prompt } from "enquirer";
import getVServerLoad from "../api/getVServerLoad";
import getVServerUptime from "../api/getVServerUptime";
import { Handler } from "./helper/commandTypes";

export const command = "state";
export const desc = "Get the state of your vServer";

export const builder: CommandBuilder = (yargs) => {
  return yargs.options({
    ...serverIdOption,
  });
};

export const handler: Handler<serverIdArgument> = async (args) => {
  if (configExistOrTellMe()) return;

  const userSettings = await readConfig();

  const serveridResult = await getServerID({
    loginData: {
      loginName: userSettings.loginName,
      password: userSettings.password,
    },
    argServerId: args.serverid,
  });

  if (serveridResult.status != "ok") return;
  const serverid = serveridResult.serverid;

  const infoChoices = ["online", "processes", "load", "uptime"];

  const infos = (
    await prompt<{ infos: string[] }>({
      type: "multiselect",
      choices: infoChoices,
      message: "What infos do you want?",
      name: "infos",
    })
  ).infos;

  if (infos.includes("online")) {
    const spinner = ora("Getting online infos").start();
    const serverState = await getVServerState(
      userSettings.loginName,
      userSettings.password,
      serverid
    );

    if (serverState.status == "err") spinner.fail("Error getting online infos");
    else {
      spinner.succeed();
      console.log(
        `Your server is ${
          serverState.result == "online"
            ? chalk.green("online")
            : chalk.red("offline")
        }`
      );
    }
  }

  if (infos.includes("processes")) {
    const spinner = ora("Getting process infos").start();
    const serverState = await getVServerLoad(
      userSettings.loginName,
      userSettings.password,
      serverid
    );

    if (serverState.status == "err")
      spinner.fail("Error getting process infos");
    else {
      spinner.succeed();
      console.log(`Processes: ${serverState.result}`);
    }
  }

  if (infos.includes("load")) {
    const spinner = ora("Getting load infos").start();
    const serverState = await getVServerProcesses(
      userSettings.loginName,
      userSettings.password,
      serverid
    );

    if (serverState.status == "err") spinner.fail("Error getting load infos");
    else {
      spinner.succeed();
      console.log(`Output: ${serverState.result}`);
    }
  }

  if (infos.includes("uptime")) {
    const spinner = ora("Getting uptime infos").start();
    const serverState = await getVServerUptime(
      userSettings.loginName,
      userSettings.password,
      serverid
    );

    if (serverState.status == "err") spinner.fail("Error getting load infos");
    else {
      spinner.succeed();
      console.log(
        `Your Server is ${serverState.result.replace("-", "not")} up`
      );
    }
  }
};
