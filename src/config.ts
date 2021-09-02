import { homedir } from "os";
import { join } from "path";
import { outputJson, readJson } from "fs-extra";
import fs from "fs";

export interface Config {
  loginName: string;
  password: string;
}

export const configPath = join(homedir(), ".config", "scp-cli", "config.json");

export const readConfig = (): Promise<Config> => {
  return readJson(configPath);
};

export const writeConfig = (config: Config): Promise<void> => {
  return outputJson(configPath, config);
};

export const configExists = (): boolean => {
  return fs.existsSync(configPath);
};

export const deleteConfig = (): void => {
  fs.rmSync(configPath, { force: true });
};
