import { doRequest, requestReturnType, WebServiceSimpleResult } from "./common";

export default async (
  loginName: string,
  password: string,
  vserverName: string
): Promise<requestReturnType<WebServiceSimpleResult>> =>
  doRequest<WebServiceSimpleResult, { vserverName: string }>("startVServer", {
    loginName,
    password,
    vserverName,
  });
