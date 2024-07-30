import type {
  LeaveApplicationStatus,
  LeaveApplicationType,
} from "../../api/leave-application.type";

export interface LeaveApplicationFormValue {
  name: string;
  date: [Date, Date];
  type: LeaveApplicationType;
  status: LeaveApplicationStatus;
  reason: string;
}

export type LeaveApplicationFormType = string;

export type LeaveApplicationFormOkType = string;
