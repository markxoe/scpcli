import { CommandBuilder } from "yargs";
import { readConfig } from "../config";
import ora from "ora";
import chalk from "chalk";
import {
  configExistOrTellMe,
  getServerID,
  serverIdArgument,
  serverIdOption,
} from "./helper/common";
import getVServerIPs from "../api/getVServerIPs";
import { Handler } from "./helper/commandTypes";

export const command = "ips";
export const desc = "Get the IPs of your vServer";

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

  const serveripsSpinner = ora("Getting IP addresses").start();

  const serverIPs = await getVServerIPs(
    userSettings.loginName,
    userSettings.password,
    serverid
  );

  if (serverIPs.status == "ok" && serverIPs.result) {
    serveripsSpinner.succeed();
    console.log("\nYour vServer has the following IP addresses: \n");
    for (const ip of serverIPs.result) {
      console.log(`> ${chalk.cyan(ip)}`);
    }
  } else {
    serveripsSpinner.fail("Error getting IP addresses");
  }
};
