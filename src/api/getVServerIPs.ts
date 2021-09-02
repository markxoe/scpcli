import { doRequest, requestReturnType } from "./common";

type rawreturntype = string[];

export default async (
  loginName: string,
  password: string,
  vserverName: string
): Promise<requestReturnType<rawreturntype>> =>
  doRequest<rawreturntype, { vserverName: string }>("getVServerIPs", {
    loginName,
    password,
    vserverName,
  });
