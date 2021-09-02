import { doRequest, requestReturnType } from "./common";

export default async (
  loginName: string,
  password: string
): Promise<requestReturnType<string[]>> =>
  doRequest<string[]>("getVServers", { loginName, password });
