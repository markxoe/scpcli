import { doRequest, requestReturnType } from "./common";

export default async (
  loginName: string,
  password: string,
  vserverName: string
): Promise<requestReturnType<"online" | "offline">> =>
  doRequest<"online" | "offline", { vserverName: string }>("getVServerState", {
    loginName,
    password,
    vserverName,
  });
