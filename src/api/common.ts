import * as soap from "soap";
import { ISoapError } from "soap/lib/client";

export const apiURL = "https://www.servercontrolpanel.de/WSEndUser?wsdl";

export type requestReturnType<RawOutputType> =
  | { status: "ok"; result: RawOutputType }
  | { status: "err"; err: string };

/**
 * RawOutputType must not contain the top level "return" key
 * OptionType already contains loginName and password
 * @param actionName The Name of the action e.g. getVServers
 * @param options Other Options
 * @returns Data
 */
export const doRequest = async <RawOutputType, OptionType = {}>(
  actionName: string,
  options: { loginName: string; password: string } & OptionType
): Promise<requestReturnType<RawOutputType>> => {
  const client = await soap.createClientAsync(apiURL, { disableCache: true });

  if (client[actionName]) {
    return new Promise((resolve) => {
      client[actionName](
        options,
        (err: null | ISoapError, result: { return: RawOutputType }) => {
          if (err) {
            resolve({
              status: "err",
              err: err.message,
            });
          } else if (result) {
            resolve({ status: "ok", result: result.return });
          } else {
            resolve({ status: "err", err: "Some mysterious Error occured" });
          }
        }
      );
    });
  } else return { status: "err", err: "Action not known" };
};

export interface WebServiceSimpleResult {
  success: boolean;
  message?: string;
}
