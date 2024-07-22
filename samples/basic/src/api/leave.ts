import { faker } from "@faker-js/faker";
import {
  LeaveStatus,
  LeaveType,
  type CreateLeaveApplicationRequest,
  type CreateLeaveApplicationResponse,
  type DeleteLeaveApplicationResponse,
  type GetLeaveApplicationListResponse,
  type GetLeaveApplicationResponse,
  type LeaveApplication,
  type UpdateLeaveApplicationRequest,
  type UpdateLeaveApplicationResponse,
} from "./leave.type";
import {
  sendPaginationResponse,
  sendResponse,
} from "../constants/response-handler";
import { StatusCodes } from "../constants/status-code";

const leaveApplications: LeaveApplication[] = faker.helpers.multiple(
  () => {
    const endDate = +faker.date.recent();
    return {
      id: faker.number.int({ max: 1000 }).toString(),
      employeeId: faker.string.uuid(),
      employeeName: faker.person.fullName(),
      startDate:
        endDate - faker.number.int({ min: 86400000, max: 86400000 * 5 }),
      endDate,
      type: faker.helpers.enumValue(LeaveType),
      status: faker.helpers.enumValue(LeaveStatus),
      reason: faker.word.words({ count: { min: 5, max: 10 } }),
      createdAt: +new Date(),
    };
  },
  { count: 24 }
);

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
  return await sendResponse(StatusCodes.OK);
}

export async function getLeaveApplication(
  id: string
): Promise<GetLeaveApplicationResponse> {
  const data = leaveApplications.find((app) => app.id === id);
  return await sendResponse(StatusCodes.OK, data);
}

export async function getLeaveApplicationList(request?: {
  pageSize: number;
  pageNum: number;
}): Promise<GetLeaveApplicationListResponse> {
  const { pageSize = 10, pageNum = 1 } = request ?? {};
  return await sendPaginationResponse(StatusCodes.OK, {
    list: leaveApplications.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    total: leaveApplications.length,
  });
}

export async function updateLeaveApplication(
  request: UpdateLeaveApplicationRequest
): Promise<UpdateLeaveApplicationResponse> {
  const index = leaveApplications.findIndex((app) => app.id === request.id);
  if (index === -1) {
    return await sendResponse(StatusCodes.NOT_FOUND);
  }
  leaveApplications[index] = { ...leaveApplications[index], ...request };

  return await sendResponse(StatusCodes.OK);
}

export async function deleteLeaveApplication(
  id: string
): Promise<DeleteLeaveApplicationResponse> {
  const index = leaveApplications.findIndex((app) => app.id === id);
  if (index === -1) {
    return await sendResponse(StatusCodes.NOT_FOUND);
  }
  leaveApplications.splice(index, 1);
  return await sendResponse(StatusCodes.OK);
}
