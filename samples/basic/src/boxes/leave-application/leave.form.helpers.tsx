import type { FormRules } from "element-plus";
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

export const leaveApplicationFormRules: FormRules<LeaveApplicationFormValue> = {
  name: {
    required: true,
    message: "Please input name",
    trigger: "blur",
  },
  date: {
    required: true,
    message: "Please input date",
    trigger: "blur",
  },
  type: {
    required: true,
    message: "Please select type",
    trigger: "change",
  },
  status: {
    required: true,
    message: "Please select status",
    trigger: "change",
  },
  reason: {
    required: false,
    message: "Please input reason",
    trigger: "blur",
  },
};

export function leaveApplicationFormValue2CreateLeaveApplicationRequest(
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

export function leaveApplicationDetail2LeaveApplicationFormValue(
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
