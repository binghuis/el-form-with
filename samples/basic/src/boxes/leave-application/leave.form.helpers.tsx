import {
  LeaveApplicationStatus,
  LeaveApplicationType,
  type CreateLeaveApplicationRequest,
  type LeaveApplicationDetail,
} from "../../api/leave-application.type";
import type { LeaveApplicationFormValue } from "./leave.form.type";

export const defaultLeaveApplicationFormValue: LeaveApplicationFormValue = {
  name: "",
  date: [new Date(), new Date()],
  type: LeaveApplicationType.SICK,
  status: LeaveApplicationStatus.PENDING,
  reason: "",
};

export function LeaveApplicationFormValue2CreateLeaveApplicationRequest(
  data: LeaveApplicationFormValue
): CreateLeaveApplicationRequest {
  const { date, name, ...rest } = data;
  return {
    ...rest,
    employeeName: name,
    startDate: +date[0],
    endDate: +date[1],
  };
}

export function LeaveApplicationDetail2LeaveApplicationFormValue(
  data: LeaveApplicationDetail
): LeaveApplicationFormValue {
  const { startDate, employeeName, endDate, reason = "", ...rest } = data;
  return {
    ...rest,
    reason,
    name: employeeName,
    date: [new Date(startDate), new Date(endDate)],
  };
}
