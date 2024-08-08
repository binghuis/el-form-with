import { defineComponent } from "vue";
import { ElButton, ElForm, ElFormItem, ElInput, ElSteps } from "element-plus";
import { stepformBoxDefaultProps, type StepFormBoxProps } from "el-form-with";
import LeaveApplicationFormBox from "../leave-application/leave.form";

const TestFormBox = defineComponent<StepFormBoxProps<object[]>>(
  (props) => {
    return () => {
      return (
        <div>
          <ElSteps active={props.step}>
            <ElSteps.Step title="Step1" description="This is description" />
            <ElSteps.Step title="Step2" description="This is description" />
            <ElSteps.Step title="Step3" description="This is description" />
          </ElSteps>
          {props.step === 0 && (
            <LeaveApplicationFormBox {...props.forms?.[props.step]} />
          )}
          <ElButton disabled={!props.hasPrev} onClick={props.prev}>
            Prev
          </ElButton>
          <ElButton disabled={!props.hasNext} onClick={props.next}>
            Next
          </ElButton>
        </div>
      );
    };
  },
  { props: [...stepformBoxDefaultProps] }
);

export default TestFormBox;
