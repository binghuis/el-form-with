import type { FormRules } from "element-plus";
import type { LeaveApplicationFormValue } from "./leave.form.type";

export const rules: FormRules<LeaveApplicationFormValue> = {
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
