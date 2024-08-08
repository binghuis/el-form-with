import { defineComponent, toRaw } from "vue";
import { ElButton, ElSteps } from "element-plus";
import { stepformBoxDefaultProps } from "el-form-with";

const TestFormBox = defineComponent(
  (props) => {
    return () => {
      return (
        <div>
          <ElSteps active={props.active}>
            <ElSteps.Step title="Step1" description="This is description" />
            <ElSteps.Step title="Step2" description="This is description" />
            <ElSteps.Step title="Step3" description="This is description" />
          </ElSteps>
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
