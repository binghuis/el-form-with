import type { CommonResponse, PaginationResponse } from "./type";

export enum LeaveApplicationType {
  SICK = "Sick",
  VACATION = "Vacation",
  PERSONAL = "Personal",
  OTHER = "Other",
}

export enum LeaveApplicationStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface LeaveApplicationDetail {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: number;
  endDate: number;
  type: LeaveApplicationType;
  status: LeaveApplicationStatus;
  reason?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface CreateLeaveApplicationRequest {
  employeeName: string;
  startDate: number;
  endDate: number;
  type: LeaveApplicationType;
  reason?: string;
}

export type CreateLeaveApplicationResponse = CommonResponse;

export interface GetLeaveApplicationRequest {
  id: string;
}

export type GetLeaveApplicationResponse =
  CommonResponse<LeaveApplicationDetail>;

export type GetLeaveApplicationListResponse =
  PaginationResponse<LeaveApplicationDetail>;

export interface UpdateLeaveApplicationRequest
  extends CreateLeaveApplicationRequest {
  id: string;
}

export type UpdateLeaveApplicationResponse = CommonResponse;

export interface DeleteLeaveApplicationRequest {
  id: string;
}

export type DeleteLeaveApplicationResponse = CommonResponse;
