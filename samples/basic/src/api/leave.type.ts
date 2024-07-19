import type { CommonResponse } from "./type";

export enum LeaveType {
  SICK = "Sick",
  VACATION = "Vacation",
  PERSONAL = "Personal",
  OTHER = "Other",
}

export enum LeaveStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: number;
  endDate: number;
  type: LeaveType;
  status: LeaveStatus;
  reason?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface CreateLeaveApplicationRequest {
  employeeName: string;
  startDate: number;
  endDate: number;
  type: LeaveType;
  reason?: string;
}

export type CreateLeaveApplicationResponse = CommonResponse;

export interface GetLeaveApplicationRequest {
  id: string;
}

export type GetLeaveApplicationResponse = CommonResponse<LeaveApplication>;

export interface UpdateLeaveApplicationRequest
  extends CreateLeaveApplicationRequest {
  id: string;
}

export type UpdateLeaveApplicationResponse = CommonResponse;

export interface DeleteLeaveApplicationRequest {
  id: string;
}

export type DeleteLeaveApplicationResponse = CommonResponse;
