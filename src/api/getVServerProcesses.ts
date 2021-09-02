import { doRequest, requestReturnType } from "./common";

export default async (
  loginName: string,
  password: string,
  vserverName: string
): Promise<requestReturnType<string>> =>
  doRequest<string, { vserverName: string }>("getVServerProcesses", {
    loginName,
    password,
    vserverName,
  });
