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
import { LeaveStatus, LeaveType } from "../../api/leave.type";
import type { FormType, FormValue, OkType } from "./common.form.type";
import { defaultFormValue } from "./common.form.default";
import { rules } from "./common.form.rules";

const CommonFormBox = defineComponent<
  WEFormBoxProps<FormValue, FormType, OkType>
>(
  (props) => {
    const formValue = reactive<FormValue>({
      ...defaultFormValue,
      ...props.data,
    });

    const formRules = reactive<FormRules<FormValue>>(rules);

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
                {Object.keys(LeaveType).map((key) => (
                  <ElSelect.Option
                    value={key.toLowerCase()}
                    label={LeaveType[key as keyof typeof LeaveType]}
                  />
                ))}
              </ElSelect>
            </ElFormItem>
            <ElFormItem prop={"status"} label="Status">
              <ElSelect v-model={formValue.status}>
                {Object.keys(LeaveStatus).map((key) => (
                  <ElSelect.Option
                    value={key.toLowerCase()}
                    label={LeaveStatus[key as keyof typeof LeaveStatus]}
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

export default CommonFormBox;
