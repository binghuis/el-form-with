import type { CommonResponse } from "../api/type";
import { messages } from "./messages";
import type { StatusCodes } from "./status-code";

function sendResponse<Data extends object>(
  code: StatusCodes,
  data?: Data
): CommonResponse<Data> {
  const message = messages[code];
  return { code, message, data };
}

export { sendResponse };
