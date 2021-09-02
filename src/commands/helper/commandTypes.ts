import { Arguments } from "yargs";

export type Handler<arguments = undefined> = (
  args: Arguments<arguments>
) => Promise<void> | void;
