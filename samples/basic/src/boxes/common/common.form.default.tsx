import { LeaveStatus, LeaveType } from "../../api/leave.type";
import type { FormValue } from "./common.form.type";

export const defaultFormValue: FormValue = {
  name: "",
  date: [new Date(), new Date()],
  type: LeaveType.SICK,
  status: LeaveStatus.PENDING,
  reason: "",
};
