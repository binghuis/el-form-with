import { faker } from "@faker-js/faker";
import {
  LeaveStatus,
  type CreateLeaveApplicationRequest,
  type CreateLeaveApplicationResponse,
  type DeleteLeaveApplicationResponse,
  type GetLeaveApplicationListResponse,
  type GetLeaveApplicationResponse,
  type LeaveApplication,
  type UpdateLeaveApplicationRequest,
  type UpdateLeaveApplicationResponse,
} from "./leave.type";
import { sendResponse } from "../constants/response-handler";
import { StatusCodes } from "../constants/status-code";

const leaveApplications: LeaveApplication[] = [];

export async function createLeaveApplication(
  request: CreateLeaveApplicationRequest
): Promise<CreateLeaveApplicationResponse> {
  const application = {
    id: faker.string.nanoid(),
    employeeId: faker.string.uuid(),
    employeeName: request.employeeName,
    startDate: request.startDate,
    endDate: request.endDate,
    type: request.type,
    status: LeaveStatus.PENDING,
    reason: request.reason,
    createdAt: +new Date(),
  };

  leaveApplications.push(application);
  return sendResponse(StatusCodes.OK);
}

export async function getLeaveApplication(
  id: string
): Promise<GetLeaveApplicationResponse> {
  const data = leaveApplications.find((app) => app.id === id);
  return sendResponse(StatusCodes.OK, data);
}

export async function getLeaveApplicationList(): Promise<GetLeaveApplicationListResponse> {
  return sendResponse(StatusCodes.OK, leaveApplications);
}

export async function updateLeaveApplication(
  request: UpdateLeaveApplicationRequest
): Promise<UpdateLeaveApplicationResponse> {
  const index = leaveApplications.findIndex((app) => app.id === request.id);
  if (index === -1) {
    return sendResponse(StatusCodes.NOT_FOUND);
  }
  leaveApplications[index] = { ...leaveApplications[index], ...request };

  return sendResponse(StatusCodes.OK);
}

export async function deleteLeaveApplication(
  id: string
): Promise<DeleteLeaveApplicationResponse> {
  const index = leaveApplications.findIndex((app) => app.id === id);
  if (index === -1) {
    return sendResponse(StatusCodes.NOT_FOUND);
  }
  leaveApplications.splice(index, 1);
  return sendResponse(StatusCodes.OK);
}
