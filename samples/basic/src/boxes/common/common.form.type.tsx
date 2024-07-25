import type { LeaveStatus, LeaveType } from "../../api/leave.type";

export interface FormValue {
  name: string;
  date: [Date, Date];
  type: LeaveType;
  status: LeaveStatus;
  reason: string;
}

export type FormType = string;

export type OkType = string;
