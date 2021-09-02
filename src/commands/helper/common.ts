import chalk from "chalk";
import { prompt } from "enquirer";
import ora from "ora";
import yargs from "yargs";
import getVServers from "../../api/getVServers";
import { cliscriptName } from "../../cli";
import { configExists } from "../../config";

export const serverIdOption: { [key: string]: yargs.Options } = {
  serverid: {
    string: true,
    desc: "Your Server ID",
    group: "Server",
  },
};

export interface serverIdArgument {
  serverid: string;
}

export const getServerID = async (options: {
  loginData: { loginName: string; password: string };
  argServerId?: string;
}): Promise<{ status: "err" } | { status: "ok"; serverid: string }> => {
  if (options.argServerId) {
    return { status: "ok", serverid: options.argServerId };
  } else {
    const spinnerServers = ora("List servers").start();

    const servers = await getVServers(
      options.loginData.loginName,
      options.loginData.password
    );
    if (servers.status == "ok") {
      spinnerServers.succeed();
      return {
        status: "ok",
        serverid: await prompt<{ serverid: string }>({
          type: "select",
          choices: servers.result,
          message: "Which Server?",
          name: "serverid",
        }).then((i) => i.serverid),
      };
    } else {
      spinnerServers.fail();
      return { status: "err" };
    }
  }
};

export const configExistOrTellMe = (): boolean => {
  if (!configExists()) {
    console.log(
      `You are not logged in yet.\nLogin in with ${chalk.cyan(
        cliscriptName + " login"
      )}`
    );
    return true;
  } else {
    return false;
  }
};
