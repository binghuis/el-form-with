import { faker } from "@faker-js/faker";
import type { CommonResponse, PaginationResponse } from "../api/type";
import { messages } from "./messages";
import type { StatusCodes } from "./status-code";

function delay() {
  return new Promise((resolve) =>
    setTimeout(resolve, faker.number.int({ min: 100, max: 400 }))
  );
}

export async function sendResponse<Data extends object>(
  code: StatusCodes,
  data?: Data
): Promise<CommonResponse<Data>> {
  const message = messages[code];
  await delay();
  return { code, message, data };
}

export async function sendPaginationResponse<Data extends object>(
  code: StatusCodes,
  data: { list: Data[]; total: number }
): Promise<PaginationResponse<Data>> {
  const message = messages[code];
  await delay();
  return { code, message, data };
}
