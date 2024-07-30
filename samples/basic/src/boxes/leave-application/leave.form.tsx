import { defineComponent, reactive, toRef } from "vue";
import {
  ElForm,
  ElRow,
  ElButton,
  type FormRules,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElSelect,
} from "element-plus";
import { formBoxDefaultProps, type WEFormBoxProps } from "el-form-with";
import {
  LeaveApplicationStatus,
  LeaveApplicationType,
} from "../../api/leave-application.type";
import type {
  LeaveApplicationFormType,
  LeaveApplicationFormValue,
  LeaveApplicationFormOkType,
} from "./leave.form.type";
import {
  defaultLeaveApplicationFormValue,
  leaveApplicationFormRules,
} from "./leave.form.helpers";

const LeaveApplicationFormBox = defineComponent<
  WEFormBoxProps<
    LeaveApplicationFormValue,
    LeaveApplicationFormType,
    LeaveApplicationFormOkType
  >
>(
  (props) => {
    const formValue = reactive<LeaveApplicationFormValue>({
      ...defaultLeaveApplicationFormValue,
      ...props.data,
    });

    const formRules = reactive<FormRules<LeaveApplicationFormValue>>(
      leaveApplicationFormRules
    );

    return () => {
      return (
        <div>
          <ElForm
            labelPosition="top"
            disabled={props.mode === "view"}
            ref={toRef(props.reference)}
            model={formValue}
            rules={formRules}
          >
            <ElFormItem prop={"name"} label="FullName">
              <ElInput v-model={formValue.name}></ElInput>
            </ElFormItem>
            <ElFormItem prop={"date"} label="Date">
              <ElDatePicker
                v-model={formValue.date}
                type="daterange"
              ></ElDatePicker>
            </ElFormItem>
            <ElFormItem prop={"type"} label="Type">
              <ElSelect v-model={formValue.type}>
                {Object.keys(LeaveApplicationType).map((key) => (
                  <ElSelect.Option
                    value={key.toLowerCase()}
                    label={
                      LeaveApplicationType[
                        key as keyof typeof LeaveApplicationType
                      ]
                    }
                  />
                ))}
              </ElSelect>
            </ElFormItem>
            <ElFormItem prop={"status"} label="Status">
              <ElSelect v-model={formValue.status}>
                {Object.keys(LeaveApplicationStatus).map((key) => (
                  <ElSelect.Option
                    value={key.toLowerCase()}
                    label={
                      LeaveApplicationStatus[
                        key as keyof typeof LeaveApplicationStatus
                      ]
                    }
                  />
                ))}
              </ElSelect>
            </ElFormItem>
            <ElFormItem prop={"reason"} label="Reason">
              <ElInput
                v-model={formValue.reason}
                autosize
                type="textarea"
              ></ElInput>
            </ElFormItem>
          </ElForm>

          <ElRow justify="end" class={"my-2"}>
            {props.mode !== "view" && (
              <>
                <ElButton
                  onClick={() => {
                    props.ok();
                  }}
                >
                  Submit
                </ElButton>
              </>
            )}
            <ElButton
              onClick={() => {
                props.close();
              }}
            >
              Close
            </ElButton>
          </ElRow>
        </div>
      );
    };
  },
  { props: [...formBoxDefaultProps] }
);

export default LeaveApplicationFormBox;
