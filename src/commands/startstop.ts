import { CommandBuilder } from "yargs";
import { readConfig } from "../config";
import ora from "ora";
import enquirer from "enquirer";
import startVServer from "../api/startVServer";
import stopVServer from "../api/stopVServer";
import {
  configExistOrTellMe,
  getServerID,
  serverIdArgument,
  serverIdOption,
} from "./helper/common";
import { Handler } from "./helper/commandTypes";

export const command = "startstop";
export const desc = "Start or stop you vServer";

export const builder: CommandBuilder = (yargs) => {
  return yargs.options({
    start: {
      boolean: true,
      group: "Actions",
      desc: "Start the server without asking",
    },
    stop: {
      boolean: true,
      group: "Actions",
      desc: "Stop the server without asking",
    },
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

  let startorstop: "start" | "stop" = "start";

  if (args.start) {
    startorstop = "start";
  } else if (args.stop) {
    startorstop = "stop";
  } else {
    startorstop = await enquirer
      .prompt<{ startorstop: "Starten" | "Stoppen" }>({
        type: "select",
        choices: ["Starten", "Stoppen"],
        name: "startorstop",
        message: "What do you want to do?",
      })
      .then((i) => (i.startorstop == "Starten" ? "start" : "stop"));
  }

  const startStopServerSpinner = ora(
    `${startorstop == "start" ? "Starting" : "Stopping"} the Server`
  ).start();

  const promiseResult =
    startorstop == "start"
      ? await startVServer(
          userSettings.loginName,
          userSettings.password,
          serverid
        )
      : await stopVServer(
          userSettings.loginName,
          userSettings.password,
          serverid
        );
  if (promiseResult.status == "ok" && promiseResult.result) {
    if (promiseResult.result.success) {
      startStopServerSpinner.succeed(
        `Server ${startorstop == "start" ? "started" : "stopped"}`
      );
    } else {
      startStopServerSpinner.fail(`Error: ${promiseResult.result.message}`);
    }
  } else {
    startStopServerSpinner.fail();
  }
};
